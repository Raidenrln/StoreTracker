import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Animated, Modal, StyleSheet, Text, View } from "react-native";

const ToastContext = createContext<((message: string) => void) | null>(null);

type ToastMessage = {
  id: number;
  text: string;
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [animation] = useState(() => new Animated.Value(0));
  const activeAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const nextToastId = useRef(0);

  const showToast = useCallback(
    (text: string) => {
      activeAnimation.current?.stop();
      animation.setValue(0);

      const id = nextToastId.current + 1;
      nextToastId.current = id;
      setToast({ id, text });

      const nextAnimation = Animated.sequence([
        Animated.timing(animation, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.delay(2100),
        Animated.timing(animation, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]);

      activeAnimation.current = nextAnimation;
      nextAnimation.start(({ finished }) => {
        if (finished && nextToastId.current === id) {
          activeAnimation.current = null;
          setToast(null);
        }
      });
    },
    [animation],
  );

  useEffect(() => {
    return () => activeAnimation.current?.stop();
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      <View style={styles.root}>
        {children}
        <Modal
          visible={Boolean(toast)}
          transparent
          animationType="none"
          statusBarTranslucent
          presentationStyle="overFullScreen"
          onRequestClose={() => undefined}
        >
          <View pointerEvents="box-none" style={styles.overlay}>
            {toast ? (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.toast,
                  {
                    opacity: animation,
                    transform: [
                      {
                        translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.text}>{toast.text}</Text>
              </Animated.View>
            ) : null}
          </View>
        </Modal>
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const showToast = useContext(ToastContext);
  if (!showToast) throw new Error("useToast must be used inside ToastProvider");
  return showToast;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  overlay: { flex: 1, justifyContent: "flex-end", alignItems: "center", paddingBottom: 100 },
  toast: {
    backgroundColor: "#172D22",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    elevation: 8,
    zIndex: 1000,
  },
  text: { color: "white", fontSize: 15, fontWeight: "600" },
});
