"""Export a copy of Kokoro-82M that also outputs per-phoneme durations.

The released kokoro-v1.0.onnx computes durations internally but only returns
audio; exposing the rounded duration tensor lets kokoro-onnx's create_timed()
report when every phoneme (and so every word) is spoken.
"""
from pathlib import Path

import onnx
from onnx import TensorProto, helper

MODELS = Path(__file__).resolve().parent.parent / "models"
SRC, DST = MODELS / "kokoro-v1.0.onnx", MODELS / "kokoro-v1.0.timed.onnx"
DURATION_TENSOR = "/encoder/Clip_output_0"  # round(duration).clamp(min=1) in the predictor

if __name__ == "__main__":
    m = onnx.load(str(SRC))
    if not any(DURATION_TENSOR in n.output for n in m.graph.node):
        raise SystemExit(f"{DURATION_TENSOR} not found in {SRC.name}")
    m.graph.node.append(helper.make_node("Identity", [DURATION_TENSOR], ["duration"], name="expose_duration"))
    m.graph.output.append(helper.make_tensor_value_info("duration", TensorProto.FLOAT, None))
    onnx.save(m, str(DST))
    print(f"wrote {DST.name}")
