use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{log, near_bindgen, Promise, env, AccountId};
use near_sdk::collections::UnorderedMap;

// Define the contract structure
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    paid_users: UnorderedMap<String,bool>,
    players: UnorderedMap<String,i8>,
    win_user: UnorderedMap<String,i8>,
}

// Define the default, which automatically initializes the contract
impl Default for Contract{
    fn default() -> Self{
        Self{
            paid_users: UnorderedMap::new(b"b"),
            players: UnorderedMap::new(b"p"),
            win_user: UnorderedMap::new(b"w"),
        }
    }
}

// Implement the contract structure
#[near_bindgen]
impl Contract {

    #[payable]
    pub fn pay_for_spin(&mut self, account: String) {
        self.set_paid_user(true,account);
        log!("Good luck");
    }

    pub fn send_prize(&mut self, account_id: String, point: i8, win_point: i8) -> bool {
        self.set_user_point(point,account_id.clone());
        self.set_win_user_point(win_point, account_id.clone());
        let point = self.get_user_point(account_id.clone());
        let win_point = self.get_win_user_point(account_id.clone());
        if point == win_point {
            Promise::new(env::predecessor_account_id()).transfer(2_000_000_000_000_000_000_000_000);
            return true;
        }
        return false;
    }

    pub  fn set_paid_user(&mut self, paid: bool, account_id: String) {
        self.paid_users.insert(&account_id,&paid);
    }

    pub fn get_paid_user(&self, account_id: String) -> Option<bool> {
        match self.paid_users.get(&account_id) {
            Some(value) => {
                let log_message = format!("Value off {:?}", value.clone());
                env::log(log_message.as_bytes());
                Some(value)
            },
            None => {
                let log_message = format!("not found");
                env::log(log_message.as_bytes());
                None
            }
        }
    }

    pub fn set_user_point(&mut self, point: i8, account_id: String) {
        self.players.insert(&account_id, &point);
    }

    pub fn get_user_point(&self, account_id: String) -> Option<i8> {
        match self.players.get(&account_id) {
            Some(value) => {
                let log_message = format!("Value off point {:?}", value.clone());
                env::log(log_message.as_bytes());
                Some(value)
            },
            None => {
                let log_message = format!("not found");
                env::log(log_message.as_bytes());
                None
            }
        }
    }

    pub fn set_win_user_point(&mut self, point: i8, account_id: String) {
        self.win_user.insert(&account_id, &point);
    }

    pub fn get_win_user_point(&self, account_id: String) -> Option<i8> {
        match self.win_user.get(&account_id) {
            Some(value) => {
                let log_message = format!("Value off win {:?}", value.clone());
                env::log(log_message.as_bytes());
                Some(value)
            },
            None => {
                let log_message = format!("not found");
                env::log(log_message.as_bytes());
                None
            }
        }
    }

    pub fn remove_user(&mut self, account_id: String) {
        let point = self.get_user_point(account_id.clone());
        let win_point = self.get_win_user_point(account_id.clone());
        let user_paid = self.get_paid_user(account_id.clone());

        if point != None {
            self.paid_users.remove(&account_id);
        }

        if win_point != None {
            self.win_user.remove(&account_id);
        }

        if user_paid != None {
            self.players.remove(&account_id);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn set_paid_user_then_get_test() {
        let user = String::from("test.testnet");
        let mut contract = Contract::default();
        contract.set_paid_user(true,user.clone());
        assert_eq!(
            contract.get_paid_user(user.clone()),
            Some(true)
        );
    }

    #[test]
    fn set_user_point_then_get_test() {
        let user = String::from("test.testnet");
        let mut contract = Contract::default();
        contract.set_user_point(4,user.clone());
        assert_eq!(
            contract.get_user_point(user.clone()),
            Some(4)
        );
    }

    #[test]
    fn set_win_user_point_then_get_test() {
        let user = String::from("test.testnet");
        let mut contract = Contract::default();
        contract.set_win_user_point(5,user.clone());
        assert_eq!(
            contract.get_win_user_point(user.clone()),
            Some(5)
        );
    }

    #[test]
    fn remove_all_user_records_test() {
        let user = String::from("test.testnet");
        let mut contract = Contract::default();
        contract.set_paid_user(true,user.clone());
        contract.set_user_point(4,user.clone());
        contract.set_win_user_point(5,user.clone());

        contract.remove_user(user.clone());

        assert_eq!(
            contract.get_paid_user(user.clone()),
            None
        );

        assert_eq!(
            contract.get_user_point(user.clone()),
            None
        );

        assert_eq!(
            contract.get_win_user_point(user.clone()),
            None
        );
    }
}
