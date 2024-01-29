// VoiceInput.js
import React, {forwardRef} from 'react';
import {Button, Input, Space} from '@douyinfe/semi-ui';
import styles from './VoiceInput.module.css';

const VoiceInput = forwardRef(({
  value,
  onValueChange,
  visible,
  setTheme,
  formRef,
  buttonConfig,
  sendMessage,
}, ref) => {
  if (!visible) {
    return null;
  }

  const {
    primaryButtonText,
    secondaryButtonText,
    secondaryButtonAction,
  } = buttonConfig;

  const handleSubmit = (event) => {
    event.preventDefault();
    // Access the current value from the input
    const inputValue = ref.current ? ref.current.value : '';

    if (inputValue.trim() !== '') {
      sendMessage(inputValue);
    }
  };

  const handleSecondaryAction = () => {
    // Perform the action before submitting (if any)
    if (secondaryButtonAction) {
      secondaryButtonAction();
    }

    // Submit the form only if formRef is provided
    if (ref) {
      handleSubmit(new Event('submit'));
    }
  };

  return (
      <form className={styles.voiceInputContainer} onSubmit={handleSubmit}>
        <Input
            size="large"
            className="voiceInput"
            value={value}
            ref={ref}
            validateStatus="warning"
            onChange={(value) => {
              onValueChange(value);
              if (setTheme) {
                setTheme(value);
              }
            }}
        />
        <Space>
          <Button type="warning" size="large" theme="solid"
                  className={styles.submitButton}
                  htmlType="submit">
            {primaryButtonText}
          </Button>
          {secondaryButtonText && (
              <Button type="warning" size="large" theme="solid"
                      onClick={handleSecondaryAction}
                      className={styles.submitButton}>
                {secondaryButtonText}
              </Button>
          )}
        </Space>
      </form>
  );
});

export default VoiceInput;
