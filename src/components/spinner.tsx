import React from 'react';

interface SpinnerProps {
  text?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  text = "Загрузка...",
  size = 'medium',
  className = "",
}) => {
  let scale = 1;
  if (size === 'small') scale = 0.6;
  if (size === 'large') scale = 1.2;

  const style: React.CSSProperties = {
    transform: `scale(${scale})`,
    transformOrigin: 'center center',
  };

  return (
    <div id="wifi-loader" className={className} style={style} role="status" aria-label={text}>
      <svg className="circle-outer" viewBox="0 0 86 86">
        <circle className="back" cx="43" cy="43" r="40"></circle>
        <circle className="front" cx="43" cy="43" r="40"></circle>
        <circle className="new" cx="43" cy="43" r="40"></circle>
      </svg>
      <svg className="circle-middle" viewBox="0 0 60 60">
        <circle className="back" cx="30" cy="30" r="27"></circle>
        <circle className="front" cx="30" cy="30" r="27"></circle>
      </svg>
      <svg className="circle-inner" viewBox="0 0 34 34">
        <circle className="back" cx="17" cy="17" r="14"></circle>
        <circle className="front" cx="17" cy="17" r="14"></circle>
      </svg>
      {text && <div className="text" data-text={text}></div>}
    </div>
  );
};

export default Spinner;