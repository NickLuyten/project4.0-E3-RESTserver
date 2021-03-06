module.exports = {
  ALERT_CREATE: "ALERT_CREATE",
  ALERT_CREATE_COMPANY: "ALERT_CREATE_COMPANY",
  ALERT_READ: "ALERT_READ",
  ALERT_READ_COMPANY: "ALERT_READ_COMPANY",
  ALERT_DELETE: "ALERT_DELETE",
  ALERT_DELETE_COMPANY: "ALERT_DELETE_COMPANY",
  AUTHENTICATION_CREATE: "AUTHENTICATION_CREATE",
  AUTHENTICATION_CREATE_COMPANY: "AUTHENTICATION_CREATE_COMPANY",
  AUTHENTICATION_CREATE_COMPANY_OWN: "AUTHENTICATION_CREATE_COMPANY_OWN",
  AUTHENTICATION_READ: "AUTHENTICATION_READ",
  AUTHENTICATION_READ_COMPANY: "AUTHENTICATION_READ_COMPANY",
  AUTHENTICATION_UPDATE: "AUTHENTICATION_UPDATE",
  AUTHENTICATION_UPDATE_COMPANY: "AUTHENTICATION_UPDATE_COMPANY",
  AUTHENTICATION_DELETE: "AUTHENTICATION_DELETE",
  AUTHENTICATION_DELETE_COMPANY: "AUTHENTICATION_DELETE_COMPANY",
  AUTHERIZED_USER_PER_MACHINE_CREATE: "AUTHERIZED_USER_PER_MACHINE_CREATE",
  AUTHERIZED_USER_PER_MACHINE_CREATE_COMPANY:
    "AUTHERIZED_USER_PER_MACHINE_CREATE_COMPANY",
  AUTHERIZED_USER_PER_MACHINE_READ: "AUTHERIZED_USER_PER_MACHINE_READ",
  AUTHERIZED_USER_PER_MACHINE_READ_COMPANY:
    "AUTHERIZED_USER_PER_MACHINE_READ_COMPANY",
  AUTHERIZED_USER_PER_MACHINE_DELETE: "AUTHERIZED_USER_PER_MACHINE_DELETE",
  AUTHERIZED_USER_PER_MACHINE_DELETE_COMPANY:
    "AUTHERIZED_USER_PER_MACHINE_DELETE_COMPANY",
  COMPANY_CREATE: "COMPANY_CREATE",
  COMPANY_READ: "COMPANY_READ",
  COMPANY_UPDATE: "COMPANY_UPDATE",
  COMPANY_UPDATE_COMPANY: "COMPANY_UPDATE_COMPANY",
  COMPANY_DELETE: "COMPANY_DELETE",
  TYPE_CREATE: "TYPE_CREATE",
  TYPE_CREATE_COMPANY: "TYPE_CREATE_COMPANY",
  TYPE_READ: "TYPE_READ",
  TYPE_READ_COMPANY: "TYPE_READ_COMPANY",
  TYPE_UPDATE: "TYPE_UPDATE",
  TYPE_UPDATE_COMPANY: "TYPE_UPDATE_COMPANY",
  TYPE_DELETE: "TYPE_DELETE",
  TYPE_DELETE_COMPANY: "TYPE_DELETE_COMPANY",

  USER_CREATE: "USER_CREATE",
  USER_CREATE_COMPANY: "USER_CREATE_COMPANY",
  USER_READ: "USER_READ",
  USER_READ_COMPANY: "USER_READ_COMPANY",
  USER_UPDATE: "USER_UPDATE",
  USER_UPDATE_COMPANY: "USER_UPDATE_COMPANY",
  USER_DELETE: "USER_DELETE",
  USER_DELETE_COMPANY: "USER_DELETE_COMPANY",
  USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_CREATE:
    "USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_CREATE",
  USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_CREATE_COMPANY:
    "USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_CREATE_COMPANY",
  USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_READ:
    "USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_READ",
  USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_READ_COMPANY:
    "USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_READ_COMPANY",
  USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_DELETE:
    "USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_DELETE",
  USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_DELETE_COMPANY:
    "USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_DELETE_COMPANY",
  VENDING_MACHINE_CREATE: "VENDING_MACHINE_CREATE",
  VENDING_MACHINE_CREATE_COMPANY: "VENDING_MACHINE_CREATE_COMPANY",
  VENDING_MACHINE_READ: "VENDING_MACHINE_READ",
  VENDING_MACHINE_READ_COMPANY: "VENDING_MACHINE_READ_COMPANY",
  VENDING_MACHINE_UPDATE: "VENDING_MACHINE_UPDATE",
  VENDING_MACHINE_UPDATE_COMPANY: "VENDING_MACHINE_UPDATE_COMPANY",
  VENDING_MACHINE_UPDATE_COMPANY_REFILL:
    "VENDING_MACHINE_UPDATE_COMPANY_REFILL",
  VENDING_MACHINE_DELETE: "VENDING_MACHINE_DELETE",
  VENDING_MACHINE_DELETE_COMPANY: "VENDING_MACHINE_DELETE_COMPANY",
  adminPermissions: [
    "ALERT_CREATE",
    "ALERT_READ",
    "ALERT_DELETE",
    "AUTHENTICATION_CREATE",
    "AUTHENTICATION_READ",
    "AUTHENTICATION_UPDATE",
    "AUTHENTICATION_DELETE",
    "AUTHERIZED_USER_PER_MACHINE_CREATE",
    "AUTHERIZED_USER_PER_MACHINE_READ",
    "AUTHERIZED_USER_PER_MACHINE_DELETE",
    "COMPANY_CREATE",
    "COMPANY_READ",
    "COMPANY_UPDATE",
    "COMPANY_DELETE",
    "USER_CREATE",
    "USER_READ",
    "USER_UPDATE",
    "USER_DELETE",
    "USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_CREATE",
    "USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_READ",
    "USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_DELETE",
    "VENDING_MACHINE_CREATE",
    "VENDING_MACHINE_READ",
    "VENDING_MACHINE_UPDATE",
    "VENDING_MACHINE_DELETE",
    "TYPE_CREATE",
    "TYPE_READ",
    "TYPE_UPDATE",
    "TYPE_DELETE",
  ],
  adminCompanyPermissions: [
    "ALERT_CREATE_COMPANY",
    "ALERT_READ_COMPANY",
    "ALERT_DELETE_COMPANY",
    "AUTHENTICATION_CREATE_COMPANY",
    "AUTHENTICATION_READ_COMPANY",
    "AUTHENTICATION_UPDATE_COMPANY",
    "AUTHENTICATION_DELETE_COMPANY",
    "AUTHERIZED_USER_PER_MACHINE_CREATE_COMPANY",
    "AUTHERIZED_USER_PER_MACHINE_READ_COMPANY",
    "AUTHERIZED_USER_PER_MACHINE_DELETE_COMPANY",
    "COMPANY_UPDATE_COMPANY",
    "USER_CREATE_COMPANY",
    "USER_READ_COMPANY",
    "USER_UPDATE_COMPANY",
    "USER_DELETE_COMPANY",
    "USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_CREATE_COMPANY",
    "USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_READ_COMPANY",
    "USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_DELETE_COMPANY",
    "VENDING_MACHINE_CREATE_COMPANY",
    "VENDING_MACHINE_READ_COMPANY",
    "VENDING_MACHINE_UPDATE_COMPANY",
    "VENDING_MACHINE_DELETE_COMPANY",
    "TYPE_CREATE_COMPANY",
    "TYPE_READ_COMPANY",
    "TYPE_UPDATE_COMPANY",
    "TYPE_DELETE_COMPANY",
  ],
  userPermissions: ["AUTHENTICATION_CREATE_COMPANY_OWN"],
  test: [
    "ALERT_CREATE",
    "ALERT_CREATE_COMPANY",
    "ALERT_READ",
    "ALERT_READ_COMPANY",
    "ALERT_DELETE",
    "ALERT_DELETE_COMPANY",
    "AUTHENTICATION_CREATE",
    "AUTHENTICATION_CREATE_COMPANY",
    "AUTHENTICATION_CREATE_COMPANY_OWN",
    "AUTHENTICATION_READ",
    "AUTHENTICATION_READ_COMPANY",
    "AUTHENTICATION_UPDATE",
    "AUTHENTICATION_UPDATE_COMPANY",
    "AUTHENTICATION_DELETE",
    "AUTHENTICATION_DELETE_COMPANY",
    "AUTHERIZED_USER_PER_MACHINE_CREATE",
    "AUTHERIZED_USER_PER_MACHINE_CREATE_COMPANY",
    "AUTHERIZED_USER_PER_MACHINE_READ",
    "AUTHERIZED_USER_PER_MACHINE_READ_COMPANY",
    "AUTHERIZED_USER_PER_MACHINE_DELETE",
    "AUTHERIZED_USER_PER_MACHINE_DELETE_COMPANY",
    "COMPANY_CREATE",
    "COMPANY_READ",
    "COMPANY_UPDATE",
    "COMPANY_UPDATE_COMPANY",
    "COMPANY_DELETE",
    "USER_CREATE",
    "USER_CREATE_COMPANY",
    "USER_READ",
    "USER_READ_COMPANY",
    "USER_UPDATE",
    "USER_UPDATE_COMPANY",
    "USER_DELETE",
    "USER_DELETE_COMPANY",
    "USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_CREATE",
    "USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_CREATE_COMPANY",
    "USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_READ",
    "USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_READ_COMPANY",
    "USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_DELETE",
    "USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_DELETE_COMPANY",
    "VENDING_MACHINE_CREATE",
    "VENDING_MACHINE_CREATE_COMPANY",
    "VENDING_MACHINE_READ",
    "VENDING_MACHINE_READ_COMPANY",
    "VENDING_MACHINE_UPDATE",
    "VENDING_MACHINE_UPDATE_COMPANY",
    "VENDING_MACHINE_UPDATE_COMPANY_REFILL",
    "VENDING_MACHINE_DELETE",
    "VENDING_MACHINE_DELETE_COMPANY",
    "TYPE_CREATE",
    "TYPE_CREATE_COMPANY",
    "TYPE_READ",
    "TYPE_READ_COMPANY",
    "TYPE_UPDATE",
    "TYPE_UPDATE_COMPANY",
    "TYPE_DELETE",
    "TYPE_DELETE_COMPANY",
  ],
};
