pub trait IntoStringResult<T, U> {
    fn error_to_string(self) -> Result<T, String>;
}

impl<T, U: ToString> IntoStringResult<T, U> for Result<T, U> {
    fn error_to_string(self) -> Result<T, String> {
        self.map_err(|x| x.to_string())
    }
}
