// deno-lint-ignore no-explicit-any
const IconBtn = ({ Icon, isActive, color, children, ...props }: any) => {
  return (
    <div
      className={`btn icon-btn ${isActive && "icon-btn-icon"} ${color || ""}`}
      {...props}
    >
      <span className={`${children != null && "mr-1"}`}>{Icon}</span>
      {children}
    </div>
  );
};

export default IconBtn;
