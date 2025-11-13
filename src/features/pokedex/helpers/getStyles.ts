import {
  TYPE_BG_CLASS_MAP,
  TYPE_BG_OPACITY_MAP,
  TYPE_TEXT_COLOR_CLASS_MAP,
} from "../../../shared/utils/map-styles";

export const getBackgroundColor = (type: string) => {
  const bgColor =
    TYPE_BG_CLASS_MAP[type as keyof typeof TYPE_BG_CLASS_MAP] ??
    TYPE_BG_CLASS_MAP.normal;

  return bgColor;
};

export const getTextColor = (type: string) => {
  const textColor =
    TYPE_TEXT_COLOR_CLASS_MAP[type as keyof typeof TYPE_TEXT_COLOR_CLASS_MAP] ??
    TYPE_TEXT_COLOR_CLASS_MAP.normal;

  return textColor;
};
export const getBackgroundOpacity = (type: string) => {
  const color =
    TYPE_BG_OPACITY_MAP[type as keyof typeof TYPE_BG_OPACITY_MAP] ??
    TYPE_BG_OPACITY_MAP.normal;

  return color;
};
