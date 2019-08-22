use crate::utils::Lang;
use shared::EmailHeader;
use yew::prelude::*;

#[derive(Default, Clone, PartialEq)]
pub struct Properties {
    pub lang: Lang,
    pub emails: Vec<EmailHeader>,
}

pub struct EmailList {
    emails: Vec<EmailHeader>,
    lang: Lang,
}

pub enum Msg {}
impl Component for EmailList {
    type Message = Msg;
    type Properties = Properties;
    fn create(properties: Self::Properties, _: ComponentLink<Self>) -> Self {
        EmailList {
            emails: properties.emails,
            lang: properties.lang,
        }
    }
    fn update(&mut self, _msg: Self::Message) -> ShouldRender {
        false
    }
    fn change(&mut self, props: Self::Properties) -> ShouldRender {
        let is_changed = self.emails != props.emails || self.lang != props.lang;
        self.emails = props.emails;
        self.lang = props.lang;

        is_changed
    }
}

impl EmailList {
    fn render_email_header(&self, email: &EmailHeader) -> Html<Self> {
        let class = if email.unread {
            "list-group-item list-group-item-action list-group-item-success"
        } else {
            "list-group-item list-group-item-action"
        };
        html! {
            <a href={format!("#/i/{}/e/{}", email.inbox_id, email.id)} class=class>
                <b>{&email.subject}</b><br />
                <div class="address_small" title={&email.from}>
                    <i class="fas fa-address-book"></i> {" "} <span class="underline-dotted">{&email.from}</span>
                </div>
                <div class="address_small" title={&email.to}>
                    <i class="fas fa-at"></i> {" "} <span class="underline-dotted">{&email.to}</span>
                </div>
                <div class="address_small">
                    <i class="fas fa-clock"></i> {" "}{email.received_on.format(self.lang.date_time_format())}
                </div>
            </a>
        }
    }
}

impl Renderable<EmailList> for EmailList {
    fn view(&self) -> Html<Self> {
        html! {
            <div class="col-3 list-group scrollable-column">
                { for self.emails.iter().map(|i| self.render_email_header(i))}
            </div>
        }
    }
}
