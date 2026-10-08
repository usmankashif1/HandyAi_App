import React, { ReactNode } from "react";
import {
  ScrollView,
  StyleProp,
  ViewStyle,
  ScrollViewProps,
} from "react-native";
import {
  SafeAreaView,
  Edge,
} from "react-native-safe-area-context";

interface ScrollScreenProps extends ScrollViewProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  edges?: Edge[];
}

const ScrollScreen = ({
  children,
  style,
  contentContainerStyle,
  edges = ["top", "left", "right"],
  keyboardShouldPersistTaps = "handled",
  showsVerticalScrollIndicator = false,
  ...rest
}: ScrollScreenProps) => {
  return (
    <SafeAreaView
      style={[{ flex: 1 }, style]}
      edges={edges}
    >
      <ScrollView
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        {...rest}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScrollScreen;