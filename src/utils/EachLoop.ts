import React from "react";

interface EachProps {
    data: any;
    children?: any;
    handleClick?: any;
    selectedFolder?: any
    iconMap?: any
}

// created a component itself to iterate through a list and create a array of elem, just by passing the elem u want the array of from the data
export const Each: React.FC<EachProps> = (props) =>
    props?.data.map((item: any, index: any) => props?.children && props?.children(item, index, props?.handleClick, props?.selectedFolder, props?.iconMap));
