import { TextStyle } from "react-native";
import { RF, RS } from "../utils/responsive";

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
    fontSize: RF(48),
    fontFamily: FontFamily.bold,
    lineHeight: RF(56),
  },

  heading: {
    fontSize: RF(28),
    fontFamily: FontFamily.bold,
    lineHeight: RF(36),
  },

  title: {
    fontSize: RF(24),
    fontFamily: FontFamily.semiBold,
    lineHeight: RF(32),
  },

  subtitleOne: {
    fontSize: RF(22),
    fontFamily: FontFamily.semiBold,
    lineHeight: RF(30),
  },

  subtitle: {
    fontSize: RF(20),
    fontFamily: FontFamily.medium,
    lineHeight: RF(28),
  },


  bodyLarge: {
    fontSize: RF(18),
    fontFamily: FontFamily.medium,
    lineHeight: RF(26),
  },

  body: {
    fontSize: RF(16),
    fontFamily: FontFamily.regular,
    lineHeight: RF(24),
  },

  bodySmall: {
    fontSize: RF(15),
    fontFamily: FontFamily.regular,
    lineHeight: RF(22),
  },

  caption: {
    fontSize: RF(14),
    fontFamily: FontFamily.regular,
    lineHeight: RF(20),
  },

  label: {
    fontSize: RF(13),
    fontFamily: FontFamily.medium,
    lineHeight: RF(18),
  },

  small: {
    fontSize: RF(12),
    fontFamily: FontFamily.regular,
    lineHeight: RF(16),
  },

  VerySmall: {
    fontSize: RF(10),
    fontFamily: FontFamily.regular,
    lineHeight: RF(14),
  },
};

