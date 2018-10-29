use shared::email::Email;
use std::rc::Rc;
use yew::prelude::*;
use yew::virtual_dom::VNode;
use stdweb::web::Node;
use stdweb::unstable::TryFrom;

pub enum Msg {
    ShowPlainText,
    ShowHtml,
}

pub struct EmailDisplay {
    pub email: Rc<Email>,
    pub showing_html: bool,
}

#[derive(Default, Clone, PartialEq)]
pub struct Properties {
    pub email: Option<Rc<Email>>,
}

impl Component for EmailDisplay {
    type Message = Msg;
    type Properties = Properties;

    fn create(props: Self::Properties, _: ComponentLink<Self>) -> Self {
        Self {
            email: props.email.unwrap(),
            showing_html: false,
        }
    }

    fn change(&mut self, props: Self::Properties) -> ShouldRender {
        let props_email = props.email.unwrap();
        if self.email.id != props_email.id {
            self.showing_html = false;
        }
        self.email = props_email;
        true
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::ShowPlainText => {
                self.showing_html = false;
                true
            }
            Msg::ShowHtml => {
                self.showing_html = true;
                true
            }
        }
    }
}

impl Renderable<EmailDisplay> for EmailDisplay {
    fn view(&self) -> Html<EmailDisplay> {
        let html_switch = if self.email.html_body.is_some() {
            html! {
                <>
                    <button type="button", onclick=|_| Msg::ShowPlainText, >{"Plain text"}</button>
                    <button type="button", onclick=|_| Msg::ShowHtml, >{"HTML"}</button>
                </>
            }
        } else {
            html! { <></> }
        };
        let body = if self.showing_html {
            let js_svg = js! {
                var div = document.createElement("div");
                div.innerHTML = @{self.email.html_body.clone().unwrap()};
                console.log(div);
                return div;
            };
            eprintln!("js_svg: {:?}", js_svg);
            let node = Node::try_from(js_svg).expect("convert js_svg");
            let vnode = VNode::VRef(node);
            eprintln!("svg: {:?}", vnode);
            vnode
        } else {
            html!{
                <> {
                    for self.email.text_plain_body
                        .as_ref()
                        .map(String::as_str)
                        .unwrap_or("")
                        .lines()
                        .map(|l| html! { <>{l}<br /></> })
                }
                </>
            }
        };
        html! {
            <div>
                <h2>{self.email.subject.as_ref().map(String::as_str).unwrap_or("")}</h2>
                {html_switch}
                {body}
            </div>
        }
    }
}
