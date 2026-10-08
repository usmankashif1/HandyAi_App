import { TextStyle } from "react-native";
import { RF } from "../utils/responsive";
import { FontSize } from "./designTokens";

export const FontFamily = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semiBold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
};

export type TypographyVariant =
  | "display"
  | "heading"
  | "title"
  | "subtitleOne"
  | "subtitle"
  | "bodyLarge"
  | "body"
  | "bodySmall"
  | "caption"
  | "label"
  | "small"
  | "VerySmall";

 


export const Typography: Record<TypographyVariant, TextStyle> = {

  display: {
    fontSize: FontSize.display,
    fontFamily: FontFamily.bold,
    lineHeight: RF(56),
  },

  heading: {
    fontSize: FontSize.heading,
    fontFamily: FontFamily.bold,
    lineHeight: RF(36),
  },

  title: {
    fontSize: FontSize.title,
    fontFamily: FontFamily.semiBold,
    lineHeight: RF(32),
  },

  subtitleOne: {
    fontSize: FontSize.subheading,
    fontFamily: FontFamily.semiBold,
    lineHeight: RF(30),
  },

  subtitle: {
    fontSize: FontSize.subtitle,
    fontFamily: FontFamily.medium,
    lineHeight: RF(28),
  },


  bodyLarge: {
    fontSize: FontSize.bodyLarge,
    fontFamily: FontFamily.medium,
    lineHeight: RF(26),
  },

  body: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.regular,
    lineHeight: RF(24),
  },

  bodySmall: {
    fontSize: FontSize.bodySmall,
    fontFamily: FontFamily.regular,
    lineHeight: RF(22),
  },

  caption: {
    fontSize: FontSize.bodySmall,
    fontFamily: FontFamily.regular,
    lineHeight: RF(20),
  },

  label: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.medium,
    lineHeight: RF(18),
  },

  small: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.regular,
    lineHeight: RF(16),
  },

  VerySmall: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.regular,
    lineHeight: RF(14),
  },
};
