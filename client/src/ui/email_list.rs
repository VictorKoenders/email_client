use shared::email::{Email, EmailHeader};
use std::rc::Rc;
use yew::prelude::*;

pub enum Msg {
    EmailClicked(usize),
}

pub struct EmailList {
    pub emails: Vec<Rc<EmailHeader>>,
    pub email_selected: Option<Callback<usize>>,
    pub current: Option<Rc<Email>>,
}

#[derive(Default, Clone, PartialEq)]
pub struct Properties {
    pub emails: Vec<Rc<EmailHeader>>,
    pub email_selected: Option<Callback<usize>>,
    pub current: Option<Rc<Email>>,
}

impl Component for EmailList {
    type Message = Msg;
    type Properties = Properties;

    fn create(props: Self::Properties, _: ComponentLink<Self>) -> Self {
        Self {
            emails: props.emails,
            email_selected: props.email_selected,
            current: props.current,
        }
    }

    fn change(&mut self, props: Self::Properties) -> ShouldRender {
        self.emails = props.emails;
        self.email_selected = props.email_selected;
        self.current = props.current;
        true
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::EmailClicked(index) => {
                if let Some(email_selected) = &self.email_selected {
                    email_selected.emit(index);
                }
                false
            }
        }
    }
}

impl EmailList {
    fn render_email(&self, index: usize, email: &EmailHeader) -> Html<EmailList> {
        let from = if let Some(from) = &email.from {
            from.as_str()
        } else {
            "unknown"
        };
        let to = if let Some(to) = &email.to {
            to.as_str()
        } else {
            "unknown"
        };
        let subject = if let Some(subject) = &email.subject {
            subject.as_str()
        } else {
            "No subject"
        };
        html! {
            <li onclick=|_|Msg::EmailClicked(index), >
                {from} {" -> "} {to}<br />
                {subject}
            </li>
        }
    }
}

impl Renderable<EmailList> for EmailList {
    fn view(&self) -> Html<EmailList> {
        html! {
            <ul>
                {for self.emails.iter()
                                .enumerate()
                                .map(|(index, email)| self.render_email(index, email) )}
            </ul>
        }
    }
}
