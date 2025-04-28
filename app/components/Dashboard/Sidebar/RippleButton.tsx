import React, { useRef } from "react";

interface RippleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  className = "",
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const createRipple = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const button = btnRef.current;
    if (!button) return;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple-effect");
    const ripple = button.getElementsByClassName("ripple-effect")[0];
    if (ripple) ripple.remove();
    button.appendChild(circle);
  };

  return (
    <button
      ref={btnRef}
      className={`relative overflow-hidden ${className}`}
      {...props}
      onClick={(e) => {
        createRipple(e);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        props.onClick && props.onClick(e);
      }}
    >
      {children}
    </button>
  );
};
