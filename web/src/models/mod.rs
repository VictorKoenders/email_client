macro_rules! wrap_database {
    ($name:ident($db_name:ident) {
        $(pub fn $fn_name:ident(
            $($param_name:ident : $param_ty:ty),*
        ) -> Result<$result:ty>;)*
    }) => {
        pub struct $name($db_name);

        impl $name {
            $(
                #[allow(dead_code)]
                pub fn $fn_name ($($param_name: $param_ty),*) -> Result<$result> {
                    $db_name::$fn_name($($param_name),*)
                        .map($name)
                        .map_err(Into::into)
                }
            )*
        }

        impl From<$db_name> for $name {
            fn from(u: $db_name) -> $name {
                $name(u)
            }
        }

        impl std::ops::Deref for $name {
            type Target = $db_name;
            fn deref(&self) -> &$db_name {
                &self.0
            }
        }
    }
}

pub mod user;
