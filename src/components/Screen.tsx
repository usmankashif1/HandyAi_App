import React, { ReactNode } from "react";
import {
  StyleProp,
  ViewStyle,
  StatusBar,
  View
} from "react-native";
import {
  SafeAreaView,
  Edge,
} from "react-native-safe-area-context";
import { Colors } from "../core/theme/colors";

interface ScreenProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  edges?: Edge[];

  statusBarStyle?: "light" | "dark" | "auto";
  statusBarBackgroundColor?: string;
}

const Screen = ({
  children,
  style,
  edges = ["top", "left", "right"],

}: ScreenProps) => {
  return (
  <SafeAreaView
    style={[{ flex: 1 }, style]}
    edges={edges}
  >
    {children}
  </SafeAreaView>
  );
};

export default Screen;