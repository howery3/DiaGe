import { Feather } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

interface Props {
  visible: boolean;
  onScanned: (code: string) => void;
  onCancel: () => void;
  hint?: string;
}

export function BarcodeScannerModal({ visible, onScanned, onCancel, hint }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  function handleBarCodeScanned({ data }: { data: string }) {
    if (scanned) return;
    setScanned(true);
    onScanned(data);
  }

  function handleOpen() {
    setScanned(false);
    if (!permission?.granted) requestPermission();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onCancel}
      onShow={handleOpen}
    >
      <View style={[styles.container, { backgroundColor: "#000" }]}>
        {!permission ? (
          <View style={styles.center}>
            <ActivityIndicator color="#fff" />
          </View>
        ) : !permission.granted ? (
          <View style={styles.center}>
            <Feather name="camera-off" size={48} color="#fff" style={{ opacity: 0.6, marginBottom: 16 }} />
            <Text style={styles.permText}>Camera access is required to scan barcodes.</Text>
            <Pressable onPress={requestPermission} style={styles.permBtn}>
              <Text style={styles.permBtnText}>Allow Camera</Text>
            </Pressable>
          </View>
        ) : (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: [
                "qr", "ean13", "ean8", "upc_a", "upc_e",
                "code39", "code128", "pdf417", "aztec", "datamatrix",
              ],
            }}
          />
        )}

        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Top */}
          <View style={[styles.overlayFill, { paddingTop: insets.top + 16, alignItems: "center" }]}>
            <Text style={styles.overlayTitle}>Scan Barcode</Text>
            {hint ? <Text style={styles.overlayHint}>{hint}</Text> : null}
          </View>

          {/* Middle row */}
          <View style={styles.middleRow}>
            <View style={styles.overlayFill} />
            <View style={styles.reticle}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
            <View style={styles.overlayFill} />
          </View>

          {/* Bottom */}
          <View style={[styles.overlayFill, { justifyContent: "flex-end", paddingBottom: insets.bottom + 40, alignItems: "center", gap: 14 }]}>
            {scanned ? (
              <Pressable onPress={() => setScanned(false)} style={styles.rescanBtn}>
                <Feather name="refresh-cw" size={16} color="#fff" />
                <Text style={styles.rescanText}>Scan Again</Text>
              </Pressable>
            ) : (
              <Text style={styles.scanningText}>Point at any barcode or QR code</Text>
            )}
            <Pressable onPress={onCancel} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const RETICLE = 240;
const CORNER = 22;
const THICKNESS = 3;
const COLOR = "#fff";

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 16 },
  permText: { color: "#fff", fontSize: 16, fontFamily: "Inter_400Regular", textAlign: "center", opacity: 0.8 },
  permBtn: { backgroundColor: "#5B21B6", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  permBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },

  overlay: { ...StyleSheet.absoluteFillObject, flexDirection: "column" },
  overlayFill: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)" },
  overlayTitle: { color: "#fff", fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 4 },
  overlayHint: { color: "rgba(255,255,255,0.7)", fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", paddingHorizontal: 32 },

  middleRow: { flexDirection: "row", height: RETICLE },
  reticle: { width: RETICLE, height: RETICLE, position: "relative" },

  corner: { position: "absolute", width: CORNER, height: CORNER },
  cornerTL: { top: 0, left: 0, borderTopWidth: THICKNESS, borderLeftWidth: THICKNESS, borderColor: COLOR, borderTopLeftRadius: 4 },
  cornerTR: { top: 0, right: 0, borderTopWidth: THICKNESS, borderRightWidth: THICKNESS, borderColor: COLOR, borderTopRightRadius: 4 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: THICKNESS, borderLeftWidth: THICKNESS, borderColor: COLOR, borderBottomLeftRadius: 4 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: THICKNESS, borderRightWidth: THICKNESS, borderColor: COLOR, borderBottomRightRadius: 4 },

  scanningText: { color: "rgba(255,255,255,0.75)", fontSize: 13, fontFamily: "Inter_400Regular" },
  rescanBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24 },
  rescanText: { color: "#fff", fontSize: 14, fontFamily: "Inter_600SemiBold" },
  cancelBtn: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.12)" },
  cancelText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
