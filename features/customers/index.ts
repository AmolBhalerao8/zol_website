export { getCustomers, getCustomerById, getCustomerStats } from "./queries/get-customers";
export { processConversationCustomerMemory } from "./services/process-conversation-customer";
export { identifyOrCreateCustomer } from "./services/identify-or-create-customer";
export {
  getCustomerDisplayName,
  normalizeEmailForMatch,
  normalizePhoneForMatch,
} from "./utils/normalize-customer-identity";
