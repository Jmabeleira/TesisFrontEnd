import { i as __toESM, t as require_react } from "./react-CZunmVaX.js";
import { $ as generateUtilityClass, D as InitColorSchemeScript$1, E as createCssVarsProvider, Et as require_prop_types, J as useThemeProps$1, Q as generateUtilityClasses, a as defaultTheme, at as createSpacing, bt as createBreakpoints, dt as createCache, ft as StyleSheet, h as createTypography, i as identifier_default, k as ThemeProvider$1, o as createTheme, pt as styleFunctionSx_default, s as createThemeWithVars, st as require_jsx_runtime, ut as CacheProvider, xt as deepmerge } from "./styled-Bnwhpcsu.js";
import { d as filledInputClasses, i as nativeSelectClasses, l as formHelperTextClasses, n as outlinedInputClasses, o as inputClasses, s as formLabelClasses } from "./outlinedInputClasses-DHgkQ_2Y.js";
//#region node_modules/@mui/styled-engine/StyledEngineProvider/StyledEngineProvider.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_prop_types = /* @__PURE__ */ __toESM(require_prop_types(), 1);
var import_jsx_runtime = require_jsx_runtime();
var cacheMap = /* @__PURE__ */ new Map();
/**
* @internal
*/
var TEST_INTERNALS_DO_NOT_USE = { 
/**
* to intercept the generated CSS before inserting to the style tag, so that we can check the generated CSS.
*
* let rule;
* TEST_INTERNALS_DO_NOT_USE.insert = (...args) => {
*    rule = args[0];
* };
*
* expect(rule).to.equal(...);
*/
insert: void 0 };
var createEmotionCache = (options, CustomSheet) => {
	const cache = createCache(options);
	cache.sheet = new CustomSheet({
		key: cache.key,
		nonce: cache.sheet.nonce,
		container: cache.sheet.container,
		speedy: cache.sheet.isSpeedy,
		prepend: cache.sheet.prepend,
		insertionPoint: cache.sheet.insertionPoint
	});
	return cache;
};
var insertionPoint;
if (typeof document === "object") {
	insertionPoint = document.querySelector("[name=\"emotion-insertion-point\"]");
	if (!insertionPoint) {
		insertionPoint = document.createElement("meta");
		insertionPoint.setAttribute("name", "emotion-insertion-point");
		insertionPoint.setAttribute("content", "");
		const head = document.querySelector("head");
		if (head) head.prepend(insertionPoint);
	}
}
function getCache(injectFirst, enableCssLayer) {
	if (injectFirst || enableCssLayer) {
		/**
		* This is for client-side apps only.
		* A custom sheet is required to make the GlobalStyles API injected above the insertion point.
		* This is because the [sheet](https://github.com/emotion-js/emotion/blob/main/packages/react/src/global.js#L94-L99) does not consume the options.
		*/
		class MyStyleSheet extends StyleSheet {
			insert(rule, options) {
				if (TEST_INTERNALS_DO_NOT_USE.insert) return TEST_INTERNALS_DO_NOT_USE.insert(rule, options);
				if (this.key && this.key.endsWith("global")) this.before = insertionPoint;
				return super.insert(rule, options);
			}
		}
		const emotionCache = createEmotionCache({
			key: enableCssLayer ? "mui" : "css",
			insertionPoint: injectFirst ? insertionPoint : void 0
		}, MyStyleSheet);
		if (enableCssLayer) {
			const prevInsert = emotionCache.insert;
			emotionCache.insert = (...args) => {
				if (!args[1].styles.match(/^@layer\s+[^{]*$/)) args[1].styles = `@layer mui {${args[1].styles}}`;
				return prevInsert(...args);
			};
		}
		return emotionCache;
	}
}
function StyledEngineProvider(props) {
	const { injectFirst, enableCssLayer, children } = props;
	const cache = import_react.useMemo(() => {
		const cacheKey = `${injectFirst}-${enableCssLayer}`;
		if (typeof document === "object" && cacheMap.has(cacheKey)) return cacheMap.get(cacheKey);
		const fresh = getCache(injectFirst, enableCssLayer);
		cacheMap.set(cacheKey, fresh);
		return fresh;
	}, [injectFirst, enableCssLayer]);
	return cache ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)(CacheProvider, {
		value: cache,
		children
	}) : children;
}
StyledEngineProvider.propTypes = {
	/**
	* Your component tree.
	*/
	children: import_prop_types.default.node,
	/**
	* If `true`, the styles are wrapped in `@layer mui`.
	* Learn more about [Cascade layers](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers).
	*/
	enableCssLayer: import_prop_types.default.bool,
	/**
	* By default, the styles are injected last in the <head> element of the page.
	* As a result, they gain more specificity than any other style sheet.
	* If you want to override MUI's styles, set this prop.
	*/
	injectFirst: import_prop_types.default.bool
};
//#endregion
//#region node_modules/@mui/material/styles/adaptV4Theme.mjs
function adaptV4Theme(inputTheme) {
	console.warn(["MUI: adaptV4Theme() is deprecated.", "Follow the upgrade guide on https://mui.com/r/migration-v4#theme."].join("\n"));
	const { defaultProps = {}, mixins = {}, overrides = {}, palette = {}, props = {}, styleOverrides = {}, ...other } = inputTheme;
	const theme = {
		...other,
		components: {}
	};
	Object.keys(defaultProps).forEach((component) => {
		const componentValue = theme.components[component] || {};
		componentValue.defaultProps = defaultProps[component];
		theme.components[component] = componentValue;
	});
	Object.keys(props).forEach((component) => {
		const componentValue = theme.components[component] || {};
		componentValue.defaultProps = props[component];
		theme.components[component] = componentValue;
	});
	Object.keys(styleOverrides).forEach((component) => {
		const componentValue = theme.components[component] || {};
		componentValue.styleOverrides = styleOverrides[component];
		theme.components[component] = componentValue;
	});
	Object.keys(overrides).forEach((component) => {
		const componentValue = theme.components[component] || {};
		componentValue.styleOverrides = overrides[component];
		theme.components[component] = componentValue;
	});
	theme.spacing = createSpacing(inputTheme.spacing);
	const breakpoints = createBreakpoints(inputTheme.breakpoints || {});
	const spacing = theme.spacing;
	theme.mixins = {
		gutters: (styles = {}) => {
			return {
				paddingLeft: spacing(2),
				paddingRight: spacing(2),
				...styles,
				[breakpoints.up("sm")]: {
					paddingLeft: spacing(3),
					paddingRight: spacing(3),
					...styles[breakpoints.up("sm")]
				}
			};
		},
		...mixins
	};
	const { type: typeInput, mode: modeInput, ...paletteRest } = palette;
	const finalMode = modeInput || typeInput || "light";
	theme.palette = {
		text: { hint: finalMode === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.38)" },
		mode: finalMode,
		type: finalMode,
		...paletteRest
	};
	return theme;
}
//#endregion
//#region node_modules/@mui/material/AccordionSummary/accordionSummaryClasses.mjs
function getAccordionSummaryUtilityClass(slot) {
	return generateUtilityClass("MuiAccordionSummary", slot);
}
var accordionSummaryClasses = generateUtilityClasses("MuiAccordionSummary", [
	"root",
	"expanded",
	"focusVisible",
	"disabled",
	"gutters",
	"content",
	"expandIconWrapper"
]);
//#endregion
//#region node_modules/@mui/material/Autocomplete/autocompleteClasses.mjs
function getAutocompleteUtilityClass(slot) {
	return generateUtilityClass("MuiAutocomplete", slot);
}
var autocompleteClasses = generateUtilityClasses("MuiAutocomplete", [
	"root",
	"expanded",
	"fullWidth",
	"focused",
	"focusVisible",
	"tag",
	"tagSizeSmall",
	"tagSizeMedium",
	"hasPopupIcon",
	"hasClearIcon",
	"inputRoot",
	"input",
	"inputFocused",
	"endAdornment",
	"clearIndicator",
	"popupIndicator",
	"popupIndicatorOpen",
	"popper",
	"popperDisablePortal",
	"paper",
	"listbox",
	"loading",
	"noOptions",
	"option",
	"groupLabel",
	"groupUl"
]);
//#endregion
//#region node_modules/@mui/material/Checkbox/checkboxClasses.mjs
function getCheckboxUtilityClass(slot) {
	return generateUtilityClass("MuiCheckbox", slot);
}
var checkboxClasses = generateUtilityClasses("MuiCheckbox", [
	"root",
	"checked",
	"disabled",
	"indeterminate",
	"colorPrimary",
	"colorSecondary",
	"sizeSmall",
	"sizeMedium"
]);
//#endregion
//#region node_modules/@mui/material/FormControlLabel/formControlLabelClasses.mjs
function getFormControlLabelUtilityClasses(slot) {
	return generateUtilityClass("MuiFormControlLabel", slot);
}
var formControlLabelClasses = generateUtilityClasses("MuiFormControlLabel", [
	"root",
	"labelPlacementStart",
	"labelPlacementTop",
	"labelPlacementBottom",
	"disabled",
	"label",
	"error",
	"required",
	"asterisk"
]);
//#endregion
//#region node_modules/@mui/material/ListItemButton/listItemButtonClasses.mjs
function getListItemButtonUtilityClass(slot) {
	return generateUtilityClass("MuiListItemButton", slot);
}
var listItemButtonClasses = generateUtilityClasses("MuiListItemButton", [
	"root",
	"focusVisible",
	"dense",
	"alignItemsFlexStart",
	"disabled",
	"divider",
	"gutters",
	"selected"
]);
//#endregion
//#region node_modules/@mui/material/MenuItem/menuItemClasses.mjs
function getMenuItemUtilityClass(slot) {
	return generateUtilityClass("MuiMenuItem", slot);
}
var menuItemClasses = generateUtilityClasses("MuiMenuItem", [
	"root",
	"focusVisible",
	"dense",
	"disabled",
	"divider",
	"gutters",
	"selected"
]);
//#endregion
//#region node_modules/@mui/material/Radio/radioClasses.mjs
function getRadioUtilityClass(slot) {
	return generateUtilityClass("MuiRadio", slot);
}
var radioClasses = generateUtilityClasses("MuiRadio", [
	"root",
	"checked",
	"disabled",
	"colorPrimary",
	"colorSecondary",
	"sizeSmall"
]);
//#endregion
//#region node_modules/@mui/material/Slider/sliderClasses.mjs
function getSliderUtilityClass(slot) {
	return generateUtilityClass("MuiSlider", slot);
}
var sliderClasses = generateUtilityClasses("MuiSlider", [
	"root",
	"active",
	"colorPrimary",
	"colorSecondary",
	"colorError",
	"colorInfo",
	"colorSuccess",
	"colorWarning",
	"disabled",
	"dragging",
	"focusVisible",
	"mark",
	"markActive",
	"marked",
	"markLabel",
	"markLabelActive",
	"rail",
	"sizeSmall",
	"thumb",
	"track",
	"trackInverted",
	"trackFalse",
	"valueLabel",
	"valueLabelOpen",
	"valueLabelCircle",
	"valueLabelLabel",
	"vertical"
]);
//#endregion
//#region node_modules/@mui/material/ToggleButton/toggleButtonClasses.mjs
function getToggleButtonUtilityClass(slot) {
	return generateUtilityClass("MuiToggleButton", slot);
}
var toggleButtonClasses = generateUtilityClasses("MuiToggleButton", [
	"root",
	"disabled",
	"selected",
	"standard",
	"primary",
	"secondary",
	"sizeSmall",
	"sizeMedium",
	"sizeLarge",
	"fullWidth"
]);
//#endregion
//#region node_modules/@mui/material/styles/enhanceHighContrast.mjs
var defaultHcTokens = {
	disabled: "GrayText",
	error: "ActiveText",
	selectedBackground: "SelectedItem",
	selectedText: "SelectedItemText",
	activeBackground: "Highlight",
	activeText: "HighlightText",
	buttonBorder: "ButtonBorder",
	buttonText: "ButtonText",
	canvas: "Canvas"
};
var HCM = "@media (forced-colors: active)";
/**
* Enhances a theme with styles for Windows High Contrast Mode (forced-colors).
*
* Accepts a fully-created theme, merges in HCM component overrides using arrays
* so that Emotion emits each entry as a separate CSS rule and the browser
* cascade (rather than JS object merging) resolves specificity.
*
* @param themeInput - The theme to enhance.
* @param tokens - Override any of the default system color tokens.
* @returns The enhanced theme (same type as the input).
*
* @example
* // Use defaults
* const theme = enhanceHighContrast(createTheme({ palette: { ... } }));
*
* @example
* // Override specific tokens
* const theme = enhanceHighContrast(createTheme(), { disabled: 'ButtonText' });
*/
function enhanceHighContrast(themeInput, tokens) {
	const hcTokens = {
		disabled: tokens?.disabled ?? defaultHcTokens.disabled,
		error: tokens?.error ?? defaultHcTokens.error,
		selectedBackground: tokens?.selectedBackground ?? defaultHcTokens.selectedBackground,
		selectedText: tokens?.selectedText ?? defaultHcTokens.selectedText,
		activeBackground: tokens?.activeBackground ?? defaultHcTokens.activeBackground,
		activeText: tokens?.activeText ?? defaultHcTokens.activeText,
		buttonBorder: tokens?.buttonBorder ?? defaultHcTokens.buttonBorder,
		buttonText: tokens?.buttonText ?? defaultHcTokens.buttonText,
		canvas: tokens?.canvas ?? defaultHcTokens.canvas
	};
	const theme = { ...themeInput };
	const c = theme.components;
	theme.components = {
		...c,
		MuiAccordionSummary: {
			...c?.MuiAccordionSummary,
			styleOverrides: {
				...c?.MuiAccordionSummary?.styleOverrides,
				root: [c?.MuiAccordionSummary?.styleOverrides?.root, { [`&.${accordionSummaryClasses.disabled}`]: { [HCM]: { opacity: 1 } } }]
			}
		},
		MuiAutocomplete: {
			...c?.MuiAutocomplete,
			styleOverrides: {
				...c?.MuiAutocomplete?.styleOverrides,
				listbox: [c?.MuiAutocomplete?.styleOverrides?.listbox, { [`& .${autocompleteClasses.option}`]: {
					"&[aria-disabled=\"true\"]": { [HCM]: {
						color: hcTokens.disabled,
						opacity: 1
					} },
					[`&.${autocompleteClasses.focused}, &.${autocompleteClasses.focusVisible}`]: { [HCM]: {
						forcedColorAdjust: "none",
						color: hcTokens.activeText,
						backgroundColor: hcTokens.activeBackground
					} },
					"&[aria-selected=\"true\"]": {
						[HCM]: {
							forcedColorAdjust: "none",
							color: hcTokens.selectedText,
							backgroundColor: hcTokens.selectedBackground
						},
						[`&.${autocompleteClasses.focused}`]: { [HCM]: {
							color: hcTokens.activeText,
							backgroundColor: hcTokens.activeBackground
						} }
					}
				} }]
			}
		},
		MuiCheckbox: {
			...c?.MuiCheckbox,
			styleOverrides: {
				...c?.MuiCheckbox?.styleOverrides,
				root: [c?.MuiCheckbox?.styleOverrides?.root, { [`&.${checkboxClasses.disabled}`]: { [HCM]: { color: hcTokens.disabled } } }]
			}
		},
		MuiFilledInput: {
			...c?.MuiFilledInput,
			styleOverrides: {
				...c?.MuiFilledInput?.styleOverrides,
				root: [c?.MuiFilledInput?.styleOverrides?.root, {
					[`&.${filledInputClasses.error}`]: { "&::before, &::after": { [HCM]: { borderBottomColor: hcTokens.error } } },
					[`&.${filledInputClasses.disabled}:before`]: { [HCM]: {
						borderBottomStyle: "solid",
						borderBottomColor: hcTokens.disabled
					} },
					[`&.${filledInputClasses.disabled}`]: { [HCM]: { color: hcTokens.disabled } }
				}]
			}
		},
		MuiFormControlLabel: {
			...c?.MuiFormControlLabel,
			styleOverrides: {
				...c?.MuiFormControlLabel?.styleOverrides,
				root: [c?.MuiFormControlLabel?.styleOverrides?.root, { [`& .${formControlLabelClasses.label}.${formControlLabelClasses.disabled}`]: { [HCM]: { color: hcTokens.disabled } } }]
			}
		},
		MuiFormHelperText: {
			...c?.MuiFormHelperText,
			styleOverrides: {
				...c?.MuiFormHelperText?.styleOverrides,
				root: [c?.MuiFormHelperText?.styleOverrides?.root, {
					[`&.${formHelperTextClasses.error}`]: { [HCM]: { color: hcTokens.error } },
					[`&.${formHelperTextClasses.disabled}`]: { [HCM]: { color: hcTokens.disabled } }
				}]
			}
		},
		MuiFormLabel: {
			...c?.MuiFormLabel,
			styleOverrides: {
				...c?.MuiFormLabel?.styleOverrides,
				root: [c?.MuiFormLabel?.styleOverrides?.root, {
					[`&.${formLabelClasses.error}`]: { [HCM]: { color: hcTokens.error } },
					[`&.${formLabelClasses.disabled}`]: { [HCM]: { color: hcTokens.disabled } }
				}]
			}
		},
		MuiInput: {
			...c?.MuiInput,
			styleOverrides: {
				...c?.MuiInput?.styleOverrides,
				root: [c?.MuiInput?.styleOverrides?.root, {
					[`&.${inputClasses.error}`]: { "&::before, &::after": { [HCM]: { borderBottomColor: hcTokens.error } } },
					[`&.${inputClasses.disabled}:before`]: { [HCM]: {
						borderBottomStyle: "solid",
						borderBottomColor: hcTokens.disabled
					} },
					[`&.${inputClasses.disabled}`]: { [HCM]: { color: hcTokens.disabled } }
				}]
			}
		},
		MuiLinearProgress: {
			...c?.MuiLinearProgress,
			styleOverrides: {
				...c?.MuiLinearProgress?.styleOverrides,
				root: [c?.MuiLinearProgress?.styleOverrides?.root, { [HCM]: {
					forcedColorAdjust: "none",
					outline: `1px solid ${hcTokens.buttonBorder}`,
					backgroundColor: hcTokens.canvas
				} }],
				bar: [c?.MuiLinearProgress?.styleOverrides?.bar, { [HCM]: { backgroundColor: hcTokens.buttonText } }],
				bar2: [c?.MuiLinearProgress?.styleOverrides?.bar2, { variants: [{
					props: { variant: "buffer" },
					style: { [HCM]: { backgroundColor: hcTokens.disabled } }
				}] }]
			}
		},
		MuiInputBase: {
			...c?.MuiInputBase,
			styleOverrides: {
				...c?.MuiInputBase?.styleOverrides,
				input: [c?.MuiInputBase?.styleOverrides?.input, { [HCM]: { "&::placeholder": { opacity: 1 } } }]
			}
		},
		MuiMenuItem: {
			...c?.MuiMenuItem,
			styleOverrides: {
				...c?.MuiMenuItem?.styleOverrides,
				root: [c?.MuiMenuItem?.styleOverrides?.root, {
					[`&.${menuItemClasses.disabled}`]: { [HCM]: {
						color: hcTokens.disabled,
						opacity: 1
					} },
					[`&.${menuItemClasses.focusVisible}, &:hover`]: { [HCM]: {
						forcedColorAdjust: "none",
						color: hcTokens.activeText,
						backgroundColor: hcTokens.activeBackground,
						outline: "none"
					} },
					[`&.${menuItemClasses.selected}`]: { [HCM]: {
						forcedColorAdjust: "none",
						color: hcTokens.selectedText,
						backgroundColor: hcTokens.selectedBackground
					} },
					[`&.${menuItemClasses.selected}.${menuItemClasses.focusVisible}, &.${menuItemClasses.selected}:hover`]: { [HCM]: {
						color: hcTokens.activeText,
						backgroundColor: hcTokens.activeBackground
					} }
				}]
			}
		},
		MuiListItemIcon: {
			...c?.MuiListItemIcon,
			styleOverrides: {
				...c?.MuiListItemIcon?.styleOverrides,
				root: [c?.MuiListItemIcon?.styleOverrides?.root, { [HCM]: { color: "inherit" } }]
			}
		},
		MuiListItemButton: {
			...c?.MuiListItemButton,
			styleOverrides: {
				...c?.MuiListItemButton?.styleOverrides,
				root: [c?.MuiListItemButton?.styleOverrides?.root, {
					[`&.${listItemButtonClasses.focusVisible}, &:hover`]: { [HCM]: {
						forcedColorAdjust: "none",
						color: hcTokens.activeText,
						backgroundColor: hcTokens.activeBackground
					} },
					[`&.${listItemButtonClasses.selected}`]: { [HCM]: {
						forcedColorAdjust: "none",
						color: hcTokens.selectedText,
						backgroundColor: hcTokens.selectedBackground
					} },
					[`&.${listItemButtonClasses.selected}.${listItemButtonClasses.focusVisible}, &.${listItemButtonClasses.selected}:hover`]: { [HCM]: {
						color: hcTokens.activeText,
						backgroundColor: hcTokens.activeBackground
					} }
				}]
			}
		},
		MuiNativeSelect: {
			...c?.MuiNativeSelect,
			styleOverrides: {
				...c?.MuiNativeSelect?.styleOverrides,
				icon: [c?.MuiNativeSelect?.styleOverrides?.icon, { [`&.${nativeSelectClasses.disabled}`]: { [HCM]: { color: hcTokens.disabled } } }]
			}
		},
		MuiOutlinedInput: {
			...c?.MuiOutlinedInput,
			styleOverrides: {
				...c?.MuiOutlinedInput?.styleOverrides,
				root: [c?.MuiOutlinedInput?.styleOverrides?.root, {
					[`&.${outlinedInputClasses.error} .${outlinedInputClasses.notchedOutline}`]: { [HCM]: { borderColor: hcTokens.error } },
					[`&.${outlinedInputClasses.disabled} .${outlinedInputClasses.notchedOutline}`]: { [HCM]: { borderColor: hcTokens.disabled } },
					[`&.${outlinedInputClasses.disabled}`]: { [HCM]: { color: hcTokens.disabled } }
				}]
			}
		},
		MuiRadio: {
			...c?.MuiRadio,
			styleOverrides: {
				...c?.MuiRadio?.styleOverrides,
				root: [c?.MuiRadio?.styleOverrides?.root, { [`&.${radioClasses.disabled}`]: { [HCM]: { color: hcTokens.disabled } } }]
			}
		},
		MuiSlider: {
			...c?.MuiSlider,
			styleOverrides: {
				...c?.MuiSlider?.styleOverrides,
				track: [c?.MuiSlider?.styleOverrides?.track, ({ ownerState }) => ({ ...ownerState.disabled && { [HCM]: { borderColor: hcTokens.disabled } } })],
				thumb: [c?.MuiSlider?.styleOverrides?.thumb, { [`&.${sliderClasses.disabled}`]: { [HCM]: { borderColor: hcTokens.disabled } } }]
			}
		},
		MuiSwitch: {
			...c?.MuiSwitch,
			styleOverrides: {
				...c?.MuiSwitch?.styleOverrides,
				track: [c?.MuiSwitch?.styleOverrides?.track, ({ ownerState }) => ({ ...ownerState.disabled && { [HCM]: { borderColor: hcTokens.disabled } } })],
				thumb: [c?.MuiSwitch?.styleOverrides?.thumb, ({ ownerState }) => ({ ...ownerState.disabled && { [HCM]: { borderColor: hcTokens.disabled } } })]
			}
		},
		MuiButtonBase: {
			...c?.MuiButtonBase,
			styleOverrides: {
				...c?.MuiButtonBase?.styleOverrides,
				root: [c?.MuiButtonBase?.styleOverrides?.root, { [HCM]: { "&:focus-visible, &:focus-within:has(input:focus-visible)": { outline: `5px auto ${hcTokens.activeBackground}` } } }]
			}
		},
		MuiTooltip: {
			...c?.MuiTooltip,
			styleOverrides: {
				...c?.MuiTooltip?.styleOverrides,
				tooltip: [c?.MuiTooltip?.styleOverrides?.tooltip, { [HCM]: { border: `1px solid ${hcTokens.buttonText}` } }]
			}
		},
		MuiToggleButton: {
			...c?.MuiToggleButton,
			styleOverrides: {
				...c?.MuiToggleButton?.styleOverrides,
				root: [c?.MuiToggleButton?.styleOverrides?.root, { [`&.${toggleButtonClasses.selected}`]: {
					[HCM]: {
						forcedColorAdjust: "none",
						color: hcTokens.activeText,
						backgroundColor: hcTokens.activeBackground,
						borderColor: hcTokens.activeBackground
					},
					"&:hover": { [HCM]: {
						backgroundColor: hcTokens.activeBackground,
						borderColor: hcTokens.buttonBorder
					} }
				} }]
			}
		}
	};
	return theme;
}
//#endregion
//#region node_modules/@mui/material/styles/createMuiStrictModeTheme.mjs
function createMuiStrictModeTheme(options, ...args) {
	return createTheme(deepmerge({ unstable_strictMode: true }, options), ...args);
}
//#endregion
//#region node_modules/@mui/material/styles/createStyles.mjs
var warnedOnce$2 = false;
function createStyles(styles) {
	if (!warnedOnce$2) {
		console.warn(["MUI: createStyles from @mui/material/styles is deprecated.", "Please use @mui/styles/createStyles"].join("\n"));
		warnedOnce$2 = true;
	}
	return styles;
}
//#endregion
//#region node_modules/@mui/material/styles/cssUtils.mjs
function isUnitless(value) {
	return String(parseFloat(value)).length === String(value).length;
}
function getUnit(input) {
	return String(input).match(/[\d.\-+]*\s*(.*)/)[1] || "";
}
function toUnitless(length) {
	return parseFloat(length);
}
function convertLength(baseFontSize) {
	return (length, toUnit) => {
		const fromUnit = getUnit(length);
		if (fromUnit === toUnit) return length;
		let pxLength = toUnitless(length);
		if (fromUnit !== "px") {
			if (fromUnit === "em") pxLength = toUnitless(length) * toUnitless(baseFontSize);
			else if (fromUnit === "rem") pxLength = toUnitless(length) * toUnitless(baseFontSize);
		}
		let outputLength = pxLength;
		if (toUnit !== "px") if (toUnit === "em") outputLength = pxLength / toUnitless(baseFontSize);
		else if (toUnit === "rem") outputLength = pxLength / toUnitless(baseFontSize);
		else return length;
		return parseFloat(outputLength.toFixed(5)) + toUnit;
	};
}
function alignProperty({ size, grid }) {
	const sizeBelow = size - size % grid;
	const sizeAbove = sizeBelow + grid;
	return size - sizeBelow < sizeAbove - size ? sizeBelow : sizeAbove;
}
function fontGrid({ lineHeight, pixels, htmlFontSize }) {
	return pixels / (lineHeight * htmlFontSize);
}
/**
* generate a responsive version of a given CSS property
* @example
* responsiveProperty({
*   cssProperty: 'fontSize',
*   min: 15,
*   max: 20,
*   unit: 'px',
*   breakpoints: [300, 600],
* })
*
* // this returns
*
* {
*   fontSize: '15px',
*   '@media (min-width:300px)': {
*     fontSize: '17.5px',
*   },
*   '@media (min-width:600px)': {
*     fontSize: '20px',
*   },
* }
* @param {Object} params
* @param {string} params.cssProperty - The CSS property to be made responsive
* @param {number} params.min - The smallest value of the CSS property
* @param {number} params.max - The largest value of the CSS property
* @param {string} [params.unit] - The unit to be used for the CSS property
* @param {Array.number} [params.breakpoints]  - An array of breakpoints
* @param {number} [params.alignStep] - Round scaled value to fall under this grid
* @returns {Object} responsive styles for {params.cssProperty}
*/
function responsiveProperty({ cssProperty, min, max, unit = "rem", breakpoints = [
	600,
	900,
	1200
], transform = null }) {
	const output = { [cssProperty]: `${min}${unit}` };
	const factor = (max - min) / breakpoints[breakpoints.length - 1];
	breakpoints.forEach((breakpoint) => {
		let value = min + factor * breakpoint;
		if (transform !== null) value = transform(value);
		output[`@media (min-width:${breakpoint}px)`] = { [cssProperty]: `${Math.round(value * 1e4) / 1e4}${unit}` };
	});
	return output;
}
//#endregion
//#region node_modules/@mui/material/styles/responsiveFontSizes.mjs
function responsiveFontSizes(themeInput, options = {}) {
	const { breakpoints = [
		"sm",
		"md",
		"lg"
	], disableAlign = false, factor = 2, variants = [
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"h6",
		"subtitle1",
		"subtitle2",
		"body1",
		"body2",
		"caption",
		"button",
		"overline"
	] } = options;
	const theme = { ...themeInput };
	theme.typography = { ...theme.typography };
	const typography = theme.typography;
	const convert = convertLength(typography.htmlFontSize);
	const breakpointValues = breakpoints.map((x) => theme.breakpoints.values[x]);
	variants.forEach((variant) => {
		const style = typography[variant];
		if (!style) return;
		const remFontSize = parseFloat(convert(style.fontSize, "rem"));
		if (remFontSize <= 1) return;
		const maxFontSize = remFontSize;
		const minFontSize = 1 + (maxFontSize - 1) / factor;
		let { lineHeight } = style;
		if (!isUnitless(lineHeight) && !disableAlign) throw new Error("MUI: Unsupported non-unitless line height with grid alignment.\nUse unitless line heights instead.");
		if (!isUnitless(lineHeight)) lineHeight = parseFloat(convert(lineHeight, "rem")) / parseFloat(remFontSize);
		let transform = null;
		if (!disableAlign) transform = (value) => alignProperty({
			size: value,
			grid: fontGrid({
				pixels: 4,
				lineHeight,
				htmlFontSize: typography.htmlFontSize
			})
		});
		const responsive = responsiveProperty({
			cssProperty: "fontSize",
			min: minFontSize,
			max: maxFontSize,
			unit: "rem",
			breakpoints: breakpointValues,
			transform
		});
		if (breakpointValues.length > 0) {
			const lastBreakpoint = breakpointValues[breakpointValues.length - 1];
			responsive[`@media (min-width:${lastBreakpoint}px)`] = { fontSize: `${Math.round(maxFontSize * 1e4) / 1e4}rem` };
		}
		typography[variant] = {
			...style,
			...responsive
		};
	});
	return theme;
}
//#endregion
//#region node_modules/@mui/material/styles/useThemeProps.mjs
function useThemeProps({ props, name }) {
	return useThemeProps$1({
		props,
		name,
		defaultTheme,
		themeId: identifier_default
	});
}
//#endregion
//#region node_modules/@mui/material/styles/ThemeProviderNoVars.mjs
function ThemeProviderNoVars({ theme: themeInput, ...props }) {
	const scopedTheme = "$$material" in themeInput ? themeInput[identifier_default] : void 0;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(ThemeProvider$1, {
		...props,
		themeId: scopedTheme ? identifier_default : void 0,
		theme: scopedTheme || themeInput
	});
}
//#endregion
//#region node_modules/@mui/material/InitColorSchemeScript/InitColorSchemeScript.mjs
var defaultConfig = {
	attribute: "data-mui-color-scheme",
	colorSchemeStorageKey: "mui-color-scheme",
	defaultLightColorScheme: "light",
	defaultDarkColorScheme: "dark",
	modeStorageKey: "mui-mode"
};
/**
*
* Demos:
*
* - [InitColorSchemeScript](https://mui.com/material-ui/react-init-color-scheme-script/)
*
* API:
*
* - [InitColorSchemeScript API](https://mui.com/material-ui/api/init-color-scheme-script/)
*/
function InitColorSchemeScript(props) {
	const { defaultMode = "system", defaultLightColorScheme = defaultConfig.defaultLightColorScheme, defaultDarkColorScheme = defaultConfig.defaultDarkColorScheme, modeStorageKey = defaultConfig.modeStorageKey, colorSchemeStorageKey = defaultConfig.colorSchemeStorageKey, attribute: initialAttribute = defaultConfig.attribute, colorSchemeNode = "document.documentElement", nonce } = props;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(InitColorSchemeScript$1, {
		defaultMode,
		defaultLightColorScheme,
		defaultDarkColorScheme,
		modeStorageKey,
		colorSchemeStorageKey,
		attribute: initialAttribute,
		colorSchemeNode,
		nonce
	});
}
InitColorSchemeScript.propTypes = {
	/**
	* DOM attribute for applying a color scheme.
	* @default 'data-mui-color-scheme'
	* @example '.mode-%s' // for class based color scheme
	* @example '[data-mode-%s]' // for data-attribute without '='
	*/
	attribute: import_prop_types.default.string,
	/**
	* The node (provided as string) used to attach the color-scheme attribute.
	* @default 'document.documentElement'
	*/
	colorSchemeNode: import_prop_types.default.string,
	/**
	* localStorage key used to store `colorScheme`.
	* @default 'mui-color-scheme'
	*/
	colorSchemeStorageKey: import_prop_types.default.string,
	/**
	* The default color scheme to be used in dark mode.
	* @default 'dark'
	*/
	defaultDarkColorScheme: import_prop_types.default.string,
	/**
	* The default color scheme to be used in light mode.
	* @default 'light'
	*/
	defaultLightColorScheme: import_prop_types.default.string,
	/**
	* The default mode when the storage is empty (user's first visit).
	* @default 'system'
	*/
	defaultMode: import_prop_types.default.oneOf([
		"dark",
		"light",
		"system"
	]),
	/**
	* localStorage key used to store `mode`.
	* @default 'mui-mode'
	*/
	modeStorageKey: import_prop_types.default.string,
	/**
	* Nonce string to pass to the inline script for CSP headers.
	*/
	nonce: import_prop_types.default.string
};
//#endregion
//#region node_modules/@mui/material/styles/ThemeProviderWithVars.mjs
var { CssVarsProvider: InternalCssVarsProvider, useColorScheme, getInitColorSchemeScript: deprecatedGetInitColorSchemeScript } = createCssVarsProvider({
	themeId: identifier_default,
	theme: () => createTheme({ cssVariables: true }),
	colorSchemeStorageKey: defaultConfig.colorSchemeStorageKey,
	modeStorageKey: defaultConfig.modeStorageKey,
	defaultColorScheme: {
		light: defaultConfig.defaultLightColorScheme,
		dark: defaultConfig.defaultDarkColorScheme
	},
	resolveTheme: (theme) => {
		const newTheme = {
			...theme,
			typography: createTypography(theme.palette, theme.typography)
		};
		newTheme.unstable_sx = function sx(props) {
			return styleFunctionSx_default({
				sx: props,
				theme: this
			});
		};
		return newTheme;
	}
});
var warnedOnce$1 = false;
function Experimental_CssVarsProvider(props) {
	if (!warnedOnce$1) {
		console.warn([
			"MUI: The Experimental_CssVarsProvider component has been ported into ThemeProvider.",
			"",
			"You should use `import { ThemeProvider } from '@mui/material/styles'` instead.",
			"For more details, check out https://mui.com/material-ui/customization/css-theme-variables/usage/"
		].join("\n"));
		warnedOnce$1 = true;
	}
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(InternalCssVarsProvider, { ...props });
}
var warnedInitScriptOnce = false;
var getInitColorSchemeScript = (params) => {
	if (!warnedInitScriptOnce) {
		console.warn([
			"MUI: The getInitColorSchemeScript function has been deprecated.",
			"",
			"You should use `import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'`",
			"and replace the function call with `<InitColorSchemeScript />` instead."
		].join("\n"));
		warnedInitScriptOnce = true;
	}
	return deprecatedGetInitColorSchemeScript(params);
};
/**
* TODO: remove this export in v7
* @deprecated
* The `CssVarsProvider` component has been deprecated and ported into `ThemeProvider`.
*
* You should use `ThemeProvider` and `createTheme()` instead:
*
* ```diff
* - import { CssVarsProvider, extendTheme } from '@mui/material/styles';
* + import { ThemeProvider, createTheme } from '@mui/material/styles';
*
* - const theme = extendTheme();
* + const theme = createTheme({
* +   cssVariables: true,
* +   colorSchemes: { light: true, dark: true },
* + });
*
* - <CssVarsProvider theme={theme}>
* + <ThemeProvider theme={theme}>
* ```
*
* To see the full documentation, check out https://mui.com/material-ui/customization/css-theme-variables/usage/.
*/
var CssVarsProvider = InternalCssVarsProvider;
//#endregion
//#region node_modules/@mui/material/styles/ThemeProvider.mjs
function ThemeProvider({ theme, ...props }) {
	const noVarsTheme = import_react.useMemo(() => {
		if (typeof theme === "function") return theme;
		const muiTheme = "$$material" in theme ? theme[identifier_default] : theme;
		if (!("colorSchemes" in muiTheme)) {
			if (!("vars" in muiTheme)) return {
				...theme,
				vars: null
			};
			return theme;
		}
		return null;
	}, [theme]);
	if (noVarsTheme) return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(ThemeProviderNoVars, {
		theme: noVarsTheme,
		...props
	});
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(CssVarsProvider, {
		theme,
		...props
	});
}
//#endregion
//#region node_modules/@mui/material/styles/makeStyles.mjs
function makeStyles() {
	throw new Error("MUI: makeStyles is no longer exported from @mui/material/styles.\nYou have to import it from @mui/styles.\nSee https://mui.com/r/migration-v4/#mui-material-styles for more details.");
}
//#endregion
//#region node_modules/@mui/material/styles/withStyles.mjs
function withStyles() {
	throw new Error("MUI: withStyles is no longer exported from @mui/material/styles.\nYou have to import it from @mui/styles.\nSee https://mui.com/r/migration-v4/#mui-material-styles for more details.");
}
//#endregion
//#region node_modules/@mui/material/styles/withTheme.mjs
function withTheme() {
	throw new Error("MUI: withTheme is no longer exported from @mui/material/styles.\nYou have to import it from @mui/styles.\nSee https://mui.com/r/migration-v4/#mui-material-styles for more details.");
}
//#endregion
//#region node_modules/@mui/material/styles/experimental_extendTheme.mjs
var warnedOnce = false;
function deprecatedExtendTheme(...args) {
	if (!warnedOnce) {
		console.warn([
			"MUI: The `experimental_extendTheme` has been stabilized.",
			"",
			"You should use `import { extendTheme } from '@mui/material/styles'`"
		].join("\n"));
		warnedOnce = true;
	}
	return createThemeWithVars(...args);
}
//#endregion
//#region node_modules/@mui/material/styles/index.mjs
function experimental_sx() {
	throw new Error("MUI: The `experimental_sx` has been moved to `theme.unstable_sx`.For more details, see https://github.com/mui/material-ui/pull/35150.");
}
//#endregion
export { getFormControlLabelUtilityClasses as A, getRadioUtilityClass as C, getListItemButtonUtilityClass as D, menuItemClasses as E, accordionSummaryClasses as F, getAccordionSummaryUtilityClass as I, adaptV4Theme as L, getCheckboxUtilityClass as M, autocompleteClasses as N, listItemButtonClasses as O, getAutocompleteUtilityClass as P, StyledEngineProvider as R, sliderClasses as S, getMenuItemUtilityClass as T, createMuiStrictModeTheme as _, makeStyles as a, toggleButtonClasses as b, Experimental_CssVarsProvider as c, InitColorSchemeScript as d, useThemeProps as f, createStyles as g, toUnitless as h, withStyles as i, checkboxClasses as j, formControlLabelClasses as k, getInitColorSchemeScript as l, getUnit as m, deprecatedExtendTheme as n, ThemeProvider as o, responsiveFontSizes as p, withTheme as r, CssVarsProvider as s, experimental_sx as t, useColorScheme as u, enhanceHighContrast as v, radioClasses as w, getSliderUtilityClass as x, getToggleButtonUtilityClass as y };

//# sourceMappingURL=styles-DbCwp3Bq.js.map