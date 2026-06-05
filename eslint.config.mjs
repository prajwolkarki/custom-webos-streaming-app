import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        APP: 'readonly',
        CONFIG: 'readonly',
        KEY_CODES: 'readonly',
        SCREENS: 'readonly',
        FOCUS_ZONES: 'readonly',
        STORAGE_KEYS: 'readonly',
        KEYBOARD_LAYOUT: 'readonly',
        imageObserver: 'readonly',
        lastKeyPressTime: 'writable',
        searchDebounceTimer: 'writable',
        seasonTabTimer: 'writable',
        hudTimeout: 'writable',
        startHeroRotation: 'readonly',
        stopHeroRotation: 'readonly',
        switchTab: 'readonly',
        showDetailScreen: 'readonly',
        goBack: 'readonly',
        showToast: 'readonly',
        showLoading: 'readonly',
        openScreen: 'readonly',
        updateFocusVisuals: 'readonly',
        positionHorizontalRow: 'readonly',
        alignVerticalScroll: 'readonly',
        navigateHomeScreen: 'readonly',
        navigateDetailScreen: 'readonly',
        triggerDetailEnterAction: 'readonly',
        triggerSeasonShiftDebounce: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
  },
];
