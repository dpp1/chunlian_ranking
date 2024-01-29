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

  const handleSubmit = (inputValue) => {
    if (inputValue.trim() !== '') {
      sendMessage(inputValue);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleSubmit(value);
  };

  const handleSecondaryAction = () => {
    // Perform the action before submitting (if any)
    if (secondaryButtonAction) {
      secondaryButtonAction();
    }
  };

  return (
      <form className={styles.voiceInputContainer} onSubmit={handleFormSubmit}>
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
