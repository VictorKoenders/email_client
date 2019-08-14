use std::borrow::Cow;
use std::collections::HashMap;

#[derive(Copy, Clone, Debug, PartialEq, Eq, Hash)]
pub enum Lang {
    English,
}

impl Default for Lang {
    fn default() -> Lang {
        Lang::English
    }
}

impl Lang {
    pub fn translate(self, key: TKey) -> Cow<'static, str> {
        if let Some(entry) = TRANSLATION.get(&self).and_then(|l| l.get(&key)) {
            Cow::from(*entry)
        } else if let Some(entry) = TRANSLATION.get(&Lang::English).and_then(|l| l.get(&key)) {
            Cow::from(*entry)
        } else {
            format!("Missing translation {:?}", key).into()
        }
    }
    pub fn date_time_format(self) -> &'static str {
        match self {
            Lang::English => "%d %b %Y, %R",
        }
    }
}

#[derive(Copy, Clone, Debug, PartialEq, Eq, Hash)]
pub enum TKey {
    TitleLogin,
    ButtonLogin,
    LabelLoading,
    LabelUsername,
    LabelInboxCatchAll,
}

macro_rules! map(
    { $($key:expr => $value:expr),* $(,)? } => {
        {
            let mut m = ::std::collections::HashMap::new();
            $(
                m.insert($key, $value);
            )*
            m
        }
    };
);

lazy_static::lazy_static! {
    static ref TRANSLATION: HashMap<Lang, HashMap<TKey, &'static str>> = {
        map! {
            Lang::English => map! {
                TKey::LabelLoading => "Loading...",
                TKey::TitleLogin => "Log in",
                TKey::ButtonLogin => "Log in",
                TKey::LabelUsername => "Username",
                TKey::LabelInboxCatchAll => "Catch all",
            }
        }
    };
}
