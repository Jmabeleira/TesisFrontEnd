import { i as __toESM, t as require_react } from "./react-CZunmVaX.js";
import { $ as generateUtilityClass, Et as require_prop_types, Q as generateUtilityClasses, Tt as clsx, st as require_jsx_runtime, t as styled, wt as composeClasses } from "./styled-Bnwhpcsu.js";
import { c as memoTheme, d as capitalize_default, i as getTransitionStyles } from "./utils-ajZGJ3FL.js";
import { t as useDefaultProps } from "./DefaultPropsProvider-BQcRtwYO.js";
//#region node_modules/@mui/material/SvgIcon/svgIconClasses.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_prop_types = /* @__PURE__ */ __toESM(require_prop_types(), 1);
function getSvgIconUtilityClass(slot) {
	return generateUtilityClass("MuiSvgIcon", slot);
}
var svgIconClasses = generateUtilityClasses("MuiSvgIcon", [
	"root",
	"colorPrimary",
	"colorSecondary",
	"colorAction",
	"colorError",
	"colorDisabled",
	"fontSizeInherit",
	"fontSizeSmall",
	"fontSizeMedium",
	"fontSizeLarge"
]);
//#endregion
//#region node_modules/@mui/material/SvgIcon/SvgIcon.mjs
var import_jsx_runtime = require_jsx_runtime();
var useUtilityClasses = (ownerState) => {
	const { color, fontSize, classes } = ownerState;
	return composeClasses({ root: [
		"root",
		color !== "inherit" && `color${capitalize_default(color)}`,
		`fontSize${capitalize_default(fontSize)}`
	] }, getSvgIconUtilityClass, classes);
};
var SvgIconRoot = styled("svg", {
	name: "MuiSvgIcon",
	slot: "Root",
	overridesResolver: (props, styles) => {
		const { ownerState } = props;
		return [
			styles.root,
			ownerState.color !== "inherit" && styles[`color${capitalize_default(ownerState.color)}`],
			styles[`fontSize${capitalize_default(ownerState.fontSize)}`]
		];
	}
})(memoTheme(({ theme }) => ({
	userSelect: "none",
	width: "1em",
	height: "1em",
	display: "inline-block",
	flexShrink: 0,
	...getTransitionStyles(theme, "fill", { duration: (theme.vars ?? theme).transitions?.duration?.shorter }),
	variants: [
		{
			props: (props) => !props.hasSvgAsChild,
			style: { fill: "currentColor" }
		},
		{
			props: { fontSize: "inherit" },
			style: { fontSize: "inherit" }
		},
		{
			props: { fontSize: "small" },
			style: { fontSize: theme.typography?.pxToRem?.(20) || "1.25rem" }
		},
		{
			props: { fontSize: "medium" },
			style: { fontSize: theme.typography?.pxToRem?.(24) || "1.5rem" }
		},
		{
			props: { fontSize: "large" },
			style: { fontSize: theme.typography?.pxToRem?.(35) || "2.1875rem" }
		},
		...Object.entries((theme.vars ?? theme).palette).filter(([, value]) => value && value.main).map(([color]) => ({
			props: { color },
			style: { color: (theme.vars ?? theme).palette?.[color]?.main }
		})),
		{
			props: { color: "action" },
			style: { color: (theme.vars ?? theme).palette?.action?.active }
		},
		{
			props: { color: "disabled" },
			style: { color: (theme.vars ?? theme).palette?.action?.disabled }
		},
		{
			props: { color: "inherit" },
			style: { color: void 0 }
		}
	]
})));
var SvgIcon = /*#__PURE__*/ import_react.forwardRef(function SvgIcon(inProps, ref) {
	const props = useDefaultProps({
		props: inProps,
		name: "MuiSvgIcon"
	});
	const { children, className, color = "inherit", component = "svg", fontSize = "medium", htmlColor, inheritViewBox = false, titleAccess, viewBox = "0 0 24 24", ...other } = props;
	const hasSvgAsChild = /*#__PURE__*/ import_react.isValidElement(children) && children.type === "svg";
	const ownerState = {
		...props,
		color,
		component,
		fontSize,
		instanceFontSize: inProps.fontSize,
		inheritViewBox,
		viewBox,
		hasSvgAsChild
	};
	const more = {};
	if (!inheritViewBox) more.viewBox = viewBox;
	return /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(SvgIconRoot, {
		as: component,
		className: clsx(useUtilityClasses(ownerState).root, className),
		focusable: "false",
		color: htmlColor,
		"aria-hidden": titleAccess ? void 0 : true,
		role: titleAccess ? "img" : void 0,
		ref,
		...more,
		...other,
		...hasSvgAsChild && children.props,
		ownerState,
		children: [hasSvgAsChild ? children.props.children : children, titleAccess ? /*#__PURE__*/ (0, import_jsx_runtime.jsx)("title", { children: titleAccess }) : null]
	});
});
SvgIcon.propTypes = {
	/**
	* Node passed into the SVG element.
	*/
	children: import_prop_types.default.node,
	/**
	* Override or extend the styles applied to the component.
	*/
	classes: import_prop_types.default.object,
	/**
	* @ignore
	*/
	className: import_prop_types.default.string,
	/**
	* The color of the component.
	* It supports both default and custom theme colors, which can be added as shown in the
	* [palette customization guide](https://mui.com/material-ui/customization/palette/#custom-colors).
	* You can use the `htmlColor` prop to apply a color attribute to the SVG element.
	* @default 'inherit'
	*/
	color: import_prop_types.default.oneOfType([import_prop_types.default.oneOf([
		"inherit",
		"action",
		"disabled",
		"primary",
		"secondary",
		"error",
		"info",
		"success",
		"warning"
	]), import_prop_types.default.string]),
	/**
	* The component used for the root node.
	* Either a string to use a HTML element or a component.
	*/
	component: import_prop_types.default.elementType,
	/**
	* The fontSize applied to the icon. Defaults to 24px, but can be configure to inherit font size.
	* @default 'medium'
	*/
	fontSize: import_prop_types.default.oneOfType([import_prop_types.default.oneOf([
		"inherit",
		"large",
		"medium",
		"small"
	]), import_prop_types.default.string]),
	/**
	* Applies a color attribute to the SVG element.
	*/
	htmlColor: import_prop_types.default.string,
	/**
	* If `true`, the root node will inherit the custom `component`'s viewBox and the `viewBox`
	* prop will be ignored.
	* Useful when you want to reference a custom `component` and have `SvgIcon` pass that
	* `component`'s viewBox to the root node.
	* @default false
	*/
	inheritViewBox: import_prop_types.default.bool,
	/**
	* The shape-rendering attribute. The behavior of the different options is described on the
	* [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/shape-rendering).
	* If you are having issues with blurry icons you should investigate this prop.
	*/
	shapeRendering: import_prop_types.default.string,
	/**
	* The system prop that allows defining system overrides as well as additional CSS styles.
	*/
	sx: import_prop_types.default.oneOfType([
		import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([
			import_prop_types.default.func,
			import_prop_types.default.object,
			import_prop_types.default.bool
		])),
		import_prop_types.default.func,
		import_prop_types.default.object
	]),
	/**
	* Provides a human-readable title for the element that contains it.
	* https://www.w3.org/TR/SVG-access/#Equivalent
	*/
	titleAccess: import_prop_types.default.string,
	/**
	* Allows you to redefine what the coordinates without units mean inside an SVG element.
	* For example, if the SVG element is 500 (width) by 200 (height),
	* and you pass viewBox="0 0 50 20",
	* this means that the coordinates inside the SVG will go from the top left corner (0,0)
	* to bottom right (50,20) and each unit will be worth 10px.
	* @default '0 0 24 24'
	*/
	viewBox: import_prop_types.default.string
};
SvgIcon.muiName = "SvgIcon";
//#endregion
//#region node_modules/@mui/material/SvgIcon/createSvgIcon.mjs
/**
* Private module reserved for @mui packages.
*/
function createSvgIcon(path, displayName) {
	function Component(props, ref) {
		return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(SvgIcon, {
			"data-testid": `${displayName}Icon`,
			ref,
			...props,
			children: path
		});
	}
	Component.displayName = `${displayName}Icon`;
	Component.muiName = SvgIcon.muiName;
	return /*#__PURE__*/ import_react.memo(/*#__PURE__*/ import_react.forwardRef(Component));
}
//#endregion
export { svgIconClasses as i, SvgIcon as n, getSvgIconUtilityClass as r, createSvgIcon as t };

//# sourceMappingURL=createSvgIcon-BiyFiwCs.js.map