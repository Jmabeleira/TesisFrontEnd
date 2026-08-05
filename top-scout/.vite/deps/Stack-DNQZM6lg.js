import { i as __toESM, t as require_react } from "./react-CZunmVaX.js";
import { $ as generateUtilityClass, Et as require_prop_types, J as useThemeProps, Q as generateUtilityClasses, Tt as clsx, Z as styled, _t as handleBreakpoints, ht as getValue, it as createTheme, mt as createUnarySpacing, st as require_jsx_runtime, t as styled$1, vt as mergeBreakpointsInOrder, wt as composeClasses, xt as deepmerge, yt as resolveBreakpointValues } from "./styled-Bnwhpcsu.js";
import { t as useDefaultProps } from "./DefaultPropsProvider-BQcRtwYO.js";
//#region node_modules/@mui/system/Stack/createStack.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_prop_types = /* @__PURE__ */ __toESM(require_prop_types(), 1);
var import_jsx_runtime = require_jsx_runtime();
var defaultTheme = createTheme();
var defaultCreateStyledComponent = styled("div", {
	name: "MuiStack",
	slot: "Root"
});
function useThemePropsDefault(props) {
	return useThemeProps({
		props,
		name: "MuiStack",
		defaultTheme
	});
}
/**
* Return an array with the separator React element interspersed between
* each React node of the input children.
*
* > joinChildren([1,2,3], 0)
* [1,0,2,0,3]
*/
function joinChildren(children, separator) {
	const childrenArray = import_react.Children.toArray(children).filter(Boolean);
	return childrenArray.reduce((output, child, index) => {
		output.push(child);
		if (index < childrenArray.length - 1) output.push(/*#__PURE__*/ import_react.cloneElement(separator, { key: `separator-${index}` }));
		return output;
	}, []);
}
var getSideFromDirection = (direction) => {
	return {
		row: "Left",
		"row-reverse": "Right",
		column: "Top",
		"column-reverse": "Bottom"
	}[direction];
};
var style = ({ ownerState, theme }) => {
	let styles = {
		display: "flex",
		flexDirection: "column",
		...handleBreakpoints({ theme }, resolveBreakpointValues({
			values: ownerState.direction,
			breakpoints: theme.breakpoints.values
		}), (propValue) => ({ flexDirection: propValue }))
	};
	if (ownerState.spacing) {
		const transformer = createUnarySpacing(theme);
		const base = Object.keys(theme.breakpoints.values).reduce((acc, breakpoint) => {
			if (typeof ownerState.spacing === "object" && ownerState.spacing[breakpoint] != null || typeof ownerState.direction === "object" && ownerState.direction[breakpoint] != null) acc[breakpoint] = true;
			return acc;
		}, {});
		const directionValues = resolveBreakpointValues({
			values: ownerState.direction,
			base
		});
		const spacingValues = resolveBreakpointValues({
			values: ownerState.spacing,
			base
		});
		if (typeof directionValues === "object") Object.keys(directionValues).forEach((breakpoint, index, breakpoints) => {
			if (!directionValues[breakpoint]) directionValues[breakpoint] = index > 0 ? directionValues[breakpoints[index - 1]] : "column";
		});
		const styleFromPropValue = (propValue, breakpoint) => {
			if (ownerState.useFlexGap) return { gap: getValue(transformer, propValue) };
			return {
				"& > :not(style):not(style)": { margin: 0 },
				"& > :not(style) ~ :not(style)": { [`margin${getSideFromDirection(breakpoint ? directionValues[breakpoint] : ownerState.direction)}`]: getValue(transformer, propValue) }
			};
		};
		styles = deepmerge(styles, handleBreakpoints({ theme }, spacingValues, styleFromPropValue));
	}
	styles = mergeBreakpointsInOrder(theme.breakpoints, styles);
	return styles;
};
function createStack(options = {}) {
	const { createStyledComponent = defaultCreateStyledComponent, useThemeProps = useThemePropsDefault, componentName = "MuiStack" } = options;
	const useUtilityClasses = () => {
		return composeClasses({ root: ["root"] }, (slot) => generateUtilityClass(componentName, slot), {});
	};
	const StackRoot = createStyledComponent(style);
	const Stack = /*#__PURE__*/ import_react.forwardRef(function Grid(inProps, ref) {
		const { component = "div", direction = "column", spacing = 0, divider, children, className, useFlexGap = false, ...other } = useThemeProps(inProps);
		return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(StackRoot, {
			as: component,
			ownerState: {
				direction,
				spacing,
				useFlexGap
			},
			ref,
			className: clsx(useUtilityClasses().root, className),
			...other,
			children: divider ? joinChildren(children, divider) : children
		});
	});
	Stack.propTypes = {
		children: import_prop_types.default.node,
		direction: import_prop_types.default.oneOfType([
			import_prop_types.default.oneOf([
				"column-reverse",
				"column",
				"row-reverse",
				"row"
			]),
			import_prop_types.default.arrayOf(import_prop_types.default.oneOf([
				"column-reverse",
				"column",
				"row-reverse",
				"row"
			])),
			import_prop_types.default.object
		]),
		divider: import_prop_types.default.node,
		spacing: import_prop_types.default.oneOfType([
			import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([import_prop_types.default.number, import_prop_types.default.string])),
			import_prop_types.default.number,
			import_prop_types.default.object,
			import_prop_types.default.string
		]),
		sx: import_prop_types.default.oneOfType([
			import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([
				import_prop_types.default.func,
				import_prop_types.default.object,
				import_prop_types.default.bool
			])),
			import_prop_types.default.func,
			import_prop_types.default.object
		])
	};
	return Stack;
}
//#endregion
//#region node_modules/@mui/material/Stack/Stack.mjs
var Stack = createStack({
	createStyledComponent: styled$1("div", {
		name: "MuiStack",
		slot: "Root"
	}),
	useThemeProps: (inProps) => useDefaultProps({
		props: inProps,
		name: "MuiStack"
	})
});
Stack.propTypes = {
	/**
	* The content of the component.
	*/
	children: import_prop_types.default.node,
	/**
	* The component used for the root node.
	* Either a string to use a HTML element or a component.
	*/
	component: import_prop_types.default.elementType,
	/**
	* Defines the `flex-direction` style property.
	* It is applied for all screen sizes.
	* @default 'column'
	*/
	direction: import_prop_types.default.oneOfType([
		import_prop_types.default.oneOf([
			"column-reverse",
			"column",
			"row-reverse",
			"row"
		]),
		import_prop_types.default.arrayOf(import_prop_types.default.oneOf([
			"column-reverse",
			"column",
			"row-reverse",
			"row"
		])),
		import_prop_types.default.object
	]),
	/**
	* Add an element between each child.
	*/
	divider: import_prop_types.default.node,
	/**
	* Defines the space between immediate children.
	* @default 0
	*/
	spacing: import_prop_types.default.oneOfType([
		import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([import_prop_types.default.number, import_prop_types.default.string])),
		import_prop_types.default.number,
		import_prop_types.default.object,
		import_prop_types.default.string
	]),
	/**
	* The system prop, which allows defining system overrides as well as additional CSS styles.
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
	* If `true`, the CSS flexbox `gap` is used instead of applying `margin` to children.
	*
	* While CSS `gap` removes the [known limitations](https://mui.com/joy-ui/react-stack/#limitations),
	* it is not fully supported in some browsers. We recommend checking https://caniuse.com/?search=flex%20gap before using this flag.
	*
	* To enable this flag globally, follow the [theme's default props](https://mui.com/material-ui/customization/theme-components/#default-props) configuration.
	* @default false
	*/
	useFlexGap: import_prop_types.default.bool
};
//#endregion
//#region node_modules/@mui/material/Stack/stackClasses.mjs
var stackClasses = generateUtilityClasses("MuiStack", ["root"]);
//#endregion
export { Stack as n, stackClasses as t };

//# sourceMappingURL=Stack-DNQZM6lg.js.map