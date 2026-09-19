import os
import sys

os.environ.setdefault("TF_USE_LEGACY_KERAS", "1")

try:
    import tf_keras
    import tensorflow as tf

    if hasattr(tf_keras.layers, "LocallyConnected2D"):
        sys.modules["tensorflow.keras.layers.LocallyConnected2D"] = tf_keras.layers.LocallyConnected2D
        if hasattr(tf, "keras") and hasattr(tf.keras, "layers"):
            tf.keras.layers.LocallyConnected2D = tf_keras.layers.LocallyConnected2D
except Exception:
    pass


