#![no_std]
#![allow(dead_code)]

mod contract;
mod test;

pub use crate::contract::{ProviderRegistry, ProviderRegistryClient};
