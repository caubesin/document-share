import React from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import { styleDefObj } from "./style-customize";

const FileCustomIcon = (props) => {
    const customDefaultLabelColor = styleDefObj[props.ext]
          ? styleDefObj[props.ext]["labelColor"] ?? "#777"
          : "#777";

        // Library defined default labelCOlor
        const libDefaultGlyphColor = defaultStyles[props.ext] && defaultStyles[props.ext]["labelColor"];
    return(
        <div className="icon">
        <FileIcon
            extension={props.ext}
            glyphColor={libDefaultGlyphColor ?? customDefaultLabelColor}
            labelColor={customDefaultLabelColor}
            {...defaultStyles[props.ext]}
            {...styleDefObj[props.ext]}
        />
        </div>
    );
}

export default FileCustomIcon;