import React from "react";
export default () => {
    const [dimensions, setDimensions] = React.useState<{ height: any, width: any }>({
        height: null,
        width: null,
    });
    React.useEffect((): any => {
        function handleResize() {
            setDimensions({
                height: window?.innerHeight || null,
                width: window?.innerWidth || null,
            });
        }
        if (dimensions.width === null) handleResize();
        window.addEventListener("resize", handleResize);
        return (_: any) => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    return [dimensions.width, dimensions.height];
};
