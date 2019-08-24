use crate::utils::Lang;
use shared::Email;
use yew::prelude::*;

#[derive(Default, Clone, PartialEq)]
pub struct Properties {
    pub lang: Lang,
    pub email: Option<Email>,
}

pub struct EmailRender {
    email: Email,
    lang: Lang,
}

pub enum Msg {}
impl Component for EmailRender {
    type Message = Msg;
    type Properties = Properties;
    fn create(properties: Self::Properties, _: ComponentLink<Self>) -> Self {
        EmailRender {
            email: properties.email.unwrap(),
            lang: properties.lang,
        }
    }
    fn update(&mut self, _msg: Self::Message) -> ShouldRender {
        false
    }
    fn change(&mut self, props: Self::Properties) -> ShouldRender {
        let email = props.email.unwrap();
        let is_changed = self.email != email || self.lang != props.lang;
        self.email = email;
        self.lang = props.lang;

        is_changed
    }
}

impl EmailRender {
    fn find_main_mail_part(&self) -> Option<&shared::EmailPart> {
        self.email.parts.iter().find(|h| h.parent_part_id.is_none())
    }
    fn find_subject(&self) -> Option<&str> {
        let main_mail_part = self.find_main_mail_part();
        self.email
            .headers
            .iter()
            .find(|h| {
                part_eq_id(main_mail_part, h.mail_part_id) && h.key.to_lowercase() == "subject"
            })
            .map(|h| h.value.as_str())
    }
    fn render_part(&self, part: &shared::EmailPart) -> Html<Self> {
        let body: std::borrow::Cow<str> = if let Ok(str) = std::str::from_utf8(&part.body) {
            str.into()
        } else {
            format!("{:?}", part.body).into()
        };
        let part_header_width = if body.is_empty() { 3 } else { 6 };
        let mut headers = self
            .email
            .headers
            .iter()
            .filter(|h| part_eq_id(Some(part), h.mail_part_id))
            .map(|h| EmailRender::render_part_header(h, part_header_width));
        if body.is_empty() {
            html! { <>{for headers}</> }
        } else {
            html! {
                <>
                    <hr />
                    <div class="row">
                        <div class="col-md-8 preserve-linebreaks">{body.trim()}</div>
                        <div class="col-md-4">
                            {for headers}
                        </div>
                    </div>
                </>
            }
        }
    }

    fn render_part_header(
        header: &shared::EmailSmtpHeader,
        left_column_width: usize,
    ) -> Html<Self> {
        let left_column_class = format!("col-md-{}", left_column_width);
        let right_column_class = format!(
            "col-md-{} overflow underline-dotted",
            12 - left_column_width
        );
        html! {
            <div class="row">
                <div class={left_column_class}>
                    {&header.key}
                </div>
                <div class={right_column_class} title={&header.value}>
                    {&header.value}
                </div>
            </div>
        }
    }
}

fn part_eq_id(part: Option<&shared::EmailPart>, id: Option<shared::Uuid>) -> bool {
    match (part, id) {
        (Some(p), Some(id)) if p.id == id => true,
        _ => false,
    }
}

impl Renderable<EmailRender> for EmailRender {
    fn view(&self) -> Html<Self> {
        html! {
            <div class="col-7 scrollable-column">
                <h3>{self.find_subject().unwrap_or("No subject")}</h3>
                {for self.email.parts.iter().map(|p| self.render_part(p))}
            </div>
        }
    }
}
