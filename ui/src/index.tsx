import * as React from "react";
import * as ReactDOM from "react-dom";

import { Root } from "./components/Root";

ReactDOM.render(
    <Root />,
    document.getElementById("example")
);

declare global {
    interface Window {
        replace_url_by_image(element: HTMLAnchorElement): void;
    }
}

window.replace_url_by_image = function(element: HTMLAnchorElement) {
    const parent = element.parentElement!;
    const new_node = document.createElement("img");
    new_node.src = element.href;
    parent.replaceChild(new_node, element);
};
