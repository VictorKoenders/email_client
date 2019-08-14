pub trait VecTools {
    fn map_into<R>(self) -> Vec<R>
    where
        Self: IntoIterator,
        <Self as IntoIterator>::Item: Into<R>;
}

impl<T> VecTools for Vec<T> {
    fn map_into<R>(self) -> Vec<R>
    where
        Self: IntoIterator,
        <Self as IntoIterator>::Item: Into<R>,
    {
        self.into_iter().map(Into::into).collect()
    }
}
