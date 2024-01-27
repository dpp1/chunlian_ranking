// VoiceInput.js
import React from 'react';
import { Input } from '@douyinfe/semi-ui';

const VoiceInput = React.forwardRef(({ value, onValueChange, visible, setTheme }, ref) => {
  if (!visible) {
    return null;
  }

  return (
      <Input
          size="large"
          className="voiceInput"
          value={value}
          ref={ref}
          validateStatus='warning'
          onChange={(value) => {
            onValueChange(value);
            if (setTheme) {
              setTheme(value);
            }
          }}
      />
  );
});

export default VoiceInput;
