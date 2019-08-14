use crate::utils::{Lang, TKey};
use shared::InboxHeader;
use yew::prelude::*;

#[derive(Default, Clone, PartialEq)]
pub struct Properties {
    pub lang: Lang,
    pub inboxes: Vec<InboxHeader>,
}

pub struct InboxList {
    inboxes: Vec<InboxHeader>,
    lang: Lang,
}

pub enum Msg {}
impl Component for InboxList {
    type Message = Msg;
    type Properties = Properties;
    fn create(properties: Self::Properties, _: ComponentLink<Self>) -> Self {
        InboxList {
            inboxes: properties.inboxes,
            lang: properties.lang,
        }
    }
    fn update(&mut self, _msg: Self::Message) -> ShouldRender {
        false
    }
    fn change(&mut self, props: Self::Properties) -> ShouldRender {
        let is_changed = self.inboxes != props.inboxes || self.lang != props.lang;
        self.inboxes = props.inboxes;
        self.lang = props.lang;

        is_changed
    }
}

impl InboxList {
    fn render_inbox(&self, inbox: &InboxHeader) -> Html<Self> {
        let name: std::borrow::Cow<str> = if inbox.id.is_nil() {
            self.lang.translate(TKey::LabelInboxCatchAll)
        } else {
            inbox.name.as_str().into()
        };
        if inbox.unread_count > 0 {
            html! {
                <a href={format!("#/i/{}", inbox.id)} class="list-group-item list-group-item-action ">
                    <b>{format!("{} ({})", name, inbox.unread_count)}</b>
                </a>
            }
        } else {
            html! {
                <a href={format!("#/i/{}", inbox.id)} class="list-group-item list-group-item-action ">
                    {name}
                </a>
            }
        }
    }
}

impl Renderable<InboxList> for InboxList {
    fn view(&self) -> Html<Self> {
        html! {
            <div class="col-3 list-group">
                { for self.inboxes.iter().map(|i| self.render_inbox(i))}
            </div>
        }
    }
}
