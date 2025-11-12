import { TYPE_BG_CLASS_MAP } from "../utils/map-styles";

type Props = {
  primaryType: string;
};

const TypeBadge = ({ primaryType }: Props) => {
  const bgColor =
    TYPE_BG_CLASS_MAP[primaryType as keyof typeof TYPE_BG_CLASS_MAP] ??
    TYPE_BG_CLASS_MAP.normal;

  return (
    <span
      className={`${bgColor} capitalize text-white rounded-xl px-2 py-0.5 font-semibold`}
    >
      {primaryType}
    </span>
  );
};

export default TypeBadge;
