import React, { ReactNode } from 'react';
import {
  View,
  ViewProps,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';

interface ContainerProps extends ViewProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Container: React.FC<ContainerProps> = ({
  children,
  style,
  ...rest
}) => {
  return (
    <View style={style} {...rest}>
      {children}
    </View>
  );
};

export default Container;

 