import { i as __toESM } from "./react-CZunmVaX.js";
import { Ct as capitalize, Et as require_prop_types, O as unstable_memoTheme, a as defaultTheme, i as identifier_default, st as require_jsx_runtime, tt as GlobalStyles$1 } from "./styled-Bnwhpcsu.js";
//#region node_modules/@mui/material/utils/capitalize.mjs
var capitalize_default = capitalize;
//#endregion
//#region node_modules/@mui/material/GlobalStyles/GlobalStyles.mjs
var import_prop_types = /* @__PURE__ */ __toESM(require_prop_types(), 1);
var import_jsx_runtime = require_jsx_runtime();
function GlobalStyles(props) {
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(GlobalStyles$1, {
		...props,
		defaultTheme,
		themeId: identifier_default
	});
}
GlobalStyles.propTypes = { 
/**
* The styles you want to apply globally.
*/
styles: import_prop_types.default.oneOfType([
	import_prop_types.default.array,
	import_prop_types.default.func,
	import_prop_types.default.number,
	import_prop_types.default.object,
	import_prop_types.default.string,
	import_prop_types.default.bool
]) };
//#endregion
//#region node_modules/@mui/material/zero-styled/index.mjs
function globalCss(styles) {
	return function GlobalStylesWrapper(props) {
		return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(GlobalStyles, { styles: typeof styles === "function" ? (theme) => styles({
			theme,
			...props
		}) : styles });
	};
}
//#endregion
//#region node_modules/@mui/material/utils/memoTheme.mjs
var memoTheme = unstable_memoTheme;
//#endregion
//#region node_modules/@mui/material/styles/reducedMotion.mjs
var defaultStyles = { transition: "none" };
function resolveReducedMotionStyles(reducedMotion, styles) {
	if (reducedMotion === "always") return styles;
	if (reducedMotion === "system") return { "@media (prefers-reduced-motion: reduce)": styles };
	return null;
}
//#endregion
//#region node_modules/@mui/material/transitions/utils.mjs
var reflow = (node) => node.scrollTop;
var DEFAULT_TRANSLATE_OFFSET = {
	offsetX: 0,
	offsetY: 0
};
var EMPTY_STYLE = {};
var DEFAULT_TRANSITION_PROPS = ["all"];
var EMPTY_OPTIONS = {};
var transformOffsetIndexes = {
	matrix: [4, 5],
	matrix3d: [12, 13],
	translate: [0, 1],
	translate3d: [0, 1],
	translateX: [0, null],
	translateY: [null, 0]
};
function parseTranslateValue(value) {
	const parsedValue = parseFloat(value ?? "");
	return Number.isNaN(parsedValue) ? 0 : parsedValue;
}
function parseTransform(transform) {
	const match = transform.match(/^(matrix|matrix3d|translate|translate3d|translateX|translateY)\((.+)\)$/);
	if (!match) return null;
	return {
		type: match[1],
		values: match[2].split(",").map(parseTranslateValue)
	};
}
function getTranslateOffsetValue(values, index) {
	return index === null ? 0 : values[index] || 0;
}
/**
* Extracts the x/y translation from a CSS transform string.
*
* Transition components use these offsets when calculating off-screen positions:
* if an element is already translated, the distance needed to hide it must start
* from that visual position instead of its untransformed layout position.
*
* CSSOM commonly serializes translations as matrix() or matrix3d(), while inline
* gesture styles may use translate(), translate3d(), translateX(), or
* translateY(). This helper normalizes those supported forms into numeric pixel
* offsets and returns zero offsets for empty, none, or unsupported transforms.
*/
function getTranslateOffsets(transform) {
	if (!transform || transform === "none") return DEFAULT_TRANSLATE_OFFSET;
	const parsedTransform = parseTransform(transform);
	if (!parsedTransform) return DEFAULT_TRANSLATE_OFFSET;
	const { type, values } = parsedTransform;
	const offsetIndexes = transformOffsetIndexes[type];
	if (!offsetIndexes) return DEFAULT_TRANSLATE_OFFSET;
	return {
		offsetX: getTranslateOffsetValue(values, offsetIndexes[0]),
		offsetY: getTranslateOffsetValue(values, offsetIndexes[1])
	};
}
function normalizedTransitionCallback(nodeRef, callback) {
	return (maybeIsAppearing) => {
		if (callback) {
			const node = nodeRef.current;
			if (maybeIsAppearing === void 0) callback(node);
			else callback(node, maybeIsAppearing);
		}
	};
}
/**
* Return the child style for a transition. Reuse predefined style objects when
* no custom styles are present so memoized children see the same object.
*/
function getTransitionChildStyle(state, inProp, baseStyles, hiddenStyles, styleProp, childStyle) {
	const base = state === "exited" && !inProp ? hiddenStyles : baseStyles[state] || baseStyles.exited;
	return styleProp || childStyle ? {
		...base,
		...styleProp,
		...childStyle
	} : base;
}
function getTransitionProps(props, options) {
	const { timeout, easing, style = EMPTY_STYLE } = props;
	return {
		duration: style.transitionDuration ?? (typeof timeout === "number" ? timeout : timeout[options.mode] || 0),
		easing: style.transitionTimingFunction ?? (typeof easing === "object" ? easing[options.mode] : easing),
		delay: style.transitionDelay
	};
}
/**
* Returns CSS that disables component-owned transitions when reduced motion is active.
* Pass custom styles only when the default `transition: none` reset is not enough.
*/
function getReducedMotionStyles(theme, styles) {
	const resolvedStyles = styles ?? defaultStyles;
	return resolveReducedMotionStyles(theme.motion?.reducedMotion, resolvedStyles);
}
function getTransitionStyles(theme, props = DEFAULT_TRANSITION_PROPS, options = EMPTY_OPTIONS) {
	const transition = theme.transitions?.create?.(props, options);
	const reducedMotionStyles = getReducedMotionStyles(theme);
	if (transition === void 0) return reducedMotionStyles ?? EMPTY_STYLE;
	const transitionStyles = { transition };
	return reducedMotionStyles ? {
		...transitionStyles,
		...reducedMotionStyles
	} : transitionStyles;
}
//#endregion
export { getTranslateOffsets as a, memoTheme as c, capitalize_default as d, getTransitionStyles as i, globalCss as l, getTransitionChildStyle as n, normalizedTransitionCallback as o, getTransitionProps as r, reflow as s, getReducedMotionStyles as t, GlobalStyles as u };

//# sourceMappingURL=utils-ajZGJ3FL.js.map