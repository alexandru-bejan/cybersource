'use strict';

var countries = [{
    countryCode: 'US',
    name: {
        en_US: 'United States'
    },
    continent: 'northamerica',
    locales: ['en_US'],
    currencyCode: 'USD',
    taxation: {
        type: 'net'
    },
    priceBooks: [
        'usd-list-prices',
        'usd-sale-prices'
    ],
    dynamicForms: {
        addressDetails: {
            country: {
                type: 'select'
            },
            states: [{
                fieldName: 'state',
                type: 'select',
                required: true
            }],
            address2: {
                help: {
                    cid: 'apo-fpo',
                    label: {
                        property: 'singleshipping.apofpo',
                        file: 'checkout'
                    }
                }
            },
            phone: {
                help: {
                    cid: 'help-telephone',
                    label: {
                        property: 'singleshipping.phonerequired',
                        file: 'checkout'
                    }
                }
            }
        },
        giftRegistryEvent: {
            eventaddress: [{
                fieldName: 'country',
                type: 'select'
            }, {
                fieldName: 'states.state',
                type: 'select',
                required: true
            }],
            type: {
                type: 'select'
            }
        },
        giftRegistrySearch: {
            simple: {
                eventType: {
                    type: 'select'
                }
            },
            advanced: {
                eventMonth: {
                    type: 'select'
                },
                eventYear: {
                    type: 'select'
                },
                eventAddress: [{
                    fieldName: 'states.state',
                    type: 'select'
                }, {
                    fieldName: 'country',
                    type: 'select'
                }]
            }
        },
        expirationInfo: {
            year: {
                type: 'select',
                rowclass: 'year'
            },
            month: {
                type: 'select',
                rowclass: 'month'
            }
        }
    }
}, {
    countryCode: 'GB',
    name: {
        en_GB: 'United Kingdom'
    },
    continent: 'europe',
    locales: ['en_GB'],
    currencyCode: 'GBP',
    taxation: {
        type: 'gross'
    },
    priceBooks: [
        'gbp-list-prices',
        'gbp-sale-prices'
    ],
    dynamicForms: {
        addressDetails: {
            country: {
                type: 'select'
            },
            states: [{
                fieldName: 'state',
                type: 'input'
            }],
            phone: {
                help: {
                    cid: 'help-telephone',
                    label: {
                        property: 'singleshipping.phonerequired',
                        file: 'checkout'
                    }
                }
            }
        },
        giftRegistryEvent: {
            eventaddress: [{
                fieldName: 'country',
                type: 'select'
            }, {
                fieldName: 'states.state'
            }],
            type: {
                type: 'select'
            }
        },
        giftRegistrySearch: {
            simple: {
                eventType: {
                    type: 'select'
                }
            },
            advanced: {
                eventMonth: {
                    type: 'select'
                },
                eventYear: {
                    type: 'select'
                },
                eventAddress: [{
                    fieldName: 'states.state'
                }, {
                    fieldName: 'country',
                    type: 'select'
                }]
            }
        },
        expirationInfo: {
            year: {
                type: 'select',
                rowclass: 'year'
            },
            month: {
                type: 'select',
                rowclass: 'month'
            }
        }
    }
}, {
    countryCode: 'JP',
    name: {
        ja_JP: '日本',
        en_JP: 'Japan'
    },
    continent: 'asia',
    locales: ['ja_JP', 'en_JP'],
    currencyCode: 'JPY',
    taxation: {
        type: 'gross',
        rate: 0.1
    },
    priceBooks: [
        'jpy-list-prices',
        'jpy-sale-prices'
    ],
    dynamicForms: {
        addressDetails: {
            country: {
                type: 'select'
            },
            states: [{
                fieldName: 'state',
                type: 'select',
                required: true
            }],
            phone: {
                help: {
                    cid: 'help-telephone',
                    label: {
                        property: 'singleshipping.phonerequired',
                        file: 'checkout'
                    }
                }
            }
        },
        giftRegistryEvent: {
            eventaddress: [{
                fieldName: 'country',
                type: 'select'
            }, {
                fieldName: 'states.state',
                type: 'select',
                required: true
            }],
            type: {
                type: 'select'
            }
        },
        giftRegistrySearch: {
            simple: {
                eventType: {
                    type: 'select'
                }
            },
            advanced: {
                eventMonth: {
                    type: 'select'
                },
                eventYear: {
                    type: 'select'
                },
                eventAddress: [{
                    fieldName: 'states.state',
                    type: 'select'
                }, {
                    fieldName: 'country',
                    type: 'select'
                }]
            }
        },
        expirationInfo: {
            year: {
                type: 'select',
                rowclass: 'year'
            },
            month: {
                type: 'select',
                rowclass: 'month'
            }
        }
    }
}, {
    countryCode: 'CN',
    name: {
        zh_CN: '中国',
        en_CN: 'China'
    },
    continent: 'asia',
    locales: ['zh_CN', 'en_CN'],
    currencyCode: 'CNY',
    taxation: {
        type: 'gross',
        rate: 0.17
    },
    priceBooks: [
        'cny-list-prices',
        'cny-sale-prices'
    ],
    dynamicForms: {
        addressDetails: {
            country: {
                type: 'select'
            },
            states: [{
                fieldName: 'state',
                type: 'input',
                required: true
            }],
            phone: {
                help: {
                    cid: 'help-telephone',
                    label: {
                        property: 'singleshipping.phonerequired',
                        file: 'checkout'
                    }
                }
            }
        },
        giftRegistryEvent: {
            eventaddress: [{
                fieldName: 'country',
                type: 'select'
            }, {
                fieldName: 'states.state',
                required: true
            }],
            type: {
                type: 'select'
            }
        },
        giftRegistrySearch: {
            simple: {
                eventType: {
                    type: 'select'
                }
            },
            advanced: {
                eventMonth: {
                    type: 'select'
                },
                eventYear: {
                    type: 'select'
                },
                eventAddress: [{
                    fieldName: 'states.state'
                }, {
                    fieldName: 'country',
                    type: 'select'
                }]
            }
        },
        expirationInfo: {
            year: {
                type: 'select',
                rowclass: 'year'
            },
            month: {
                type: 'select',
                rowclass: 'month'
            }
        }
    }
}, {
    countryCode: 'FR',
    name: {
        fr_FR: 'France'
    },
    continent: 'europe',
    locales: ['fr_FR'],
    currencyCode: 'EUR',
    taxation: {
        type: 'gross',
        rate: 0.2
    },
    priceBooks: [
        'eur-list-prices',
        'eur-sale-prices'
    ],
    dynamicForms: {
        addressDetails: {
            country: {
                type: 'select'
            },
            states: {
                skip: true
            },
            phone: {
                help: {
                    cid: 'help-telephone',
                    label: {
                        property: 'singleshipping.phonerequired',
                        file: 'checkout'
                    }
                }
            }
        },
        giftRegistryEvent: {
            eventaddress: [{
                fieldName: 'country',
                type: 'select'
            }, {
                fieldName: 'states.state'

            }],
            type: {
                type: 'select'
            }
        },
        giftRegistrySearch: {
            simple: {
                eventType: {
                    type: 'select'
                }
            },
            advanced: {
                eventMonth: {
                    type: 'select'
                },
                eventYear: {
                    type: 'select'
                },
                eventAddress: [{
                    fieldName: 'states.state'
                }, {
                    fieldName: 'country',
                    type: 'select'
                }]
            }
        },
        expirationInfo: {
            year: {
                type: 'select',
                rowclass: 'year'
            },
            month: {
                type: 'select',
                rowclass: 'month'
            }
        }
    }
}, {
    countryCode: 'IT',
    name: {
        it_IT: 'Italia'
    },
    continent: 'europe',
    locales: ['it_IT'],
    currencyCode: 'EUR',
    taxation: {
        type: 'gross',
        rate: 0.22
    },
    priceBooks: [
        'eur-list-prices',
        'eur-sale-prices'
    ],
    dynamicForms: {
        addressDetails: {
            country: {
                type: 'select'
            },
            states: [{
                fieldName: 'state',
                type: 'select',
                required: true
            }],
            phone: {
                help: {
                    cid: 'help-telephone',
                    label: {
                        property: 'singleshipping.phonerequired',
                        file: 'checkout'
                    }
                }
            }
        },
        giftRegistryEvent: {
            eventaddress: [{
                fieldName: 'country',
                type: 'select'
            }, {
                fieldName: 'states.state',
                type: 'select',
                required: true
            }],
            type: {
                type: 'select'
            }
        },
        giftRegistrySearch: {
            simple: {
                eventType: {
                    type: 'select'
                }
            },
            advanced: {
                eventMonth: {
                    type: 'select'
                },
                eventYear: {
                    type: 'select'
                },
                eventAddress: [{
                    fieldName: 'states.state',
                    type: 'select'
                }, {
                    fieldName: 'country',
                    type: 'select'
                }]
            }
        },
        expirationInfo: {
            year: {
                type: 'select',
                rowclass: 'year'
            },
            month: {
                type: 'select',
                rowclass: 'month'
            }
        }
    }
}, {
    countryCode: 'DE',
    name: {
        de_DE: 'Germany'
    },
    continent: 'europe',
    locales: ['de_DE'],
    currencyCode: 'EUR',
    taxation: {
        type: 'gross',
        rate: 0.22
    },
    priceBooks: [
        'eur-list-prices',
        'eur-sale-prices'
    ],
    dynamicForms: {
        addressDetails: {
            country: {
                type: 'select'
            },
            states: [{
                fieldName: 'state',
                type: 'select',
                required: true
            }],
            phone: {
                help: {
                    cid: 'help-telephone',
                    label: {
                        property: 'singleshipping.phonerequired',
                        file: 'checkout'
                    }
                }
            }
        },
        giftRegistryEvent: {
            eventaddress: [{
                fieldName: 'country',
                type: 'select'
            }, {
                fieldName: 'states.state',
                type: 'select',
                required: true
            }],
            type: {
                type: 'select'
            }
        },
        giftRegistrySearch: {
            simple: {
                eventType: {
                    type: 'select'
                }
            },
            advanced: {
                eventMonth: {
                    type: 'select'
                },
                eventYear: {
                    type: 'select'
                },
                eventAddress: [{
                    fieldName: 'states.state',
                    type: 'select'
                }, {
                    fieldName: 'country',
                    type: 'select'
                }]
            }
        },
        expirationInfo: {
            year: {
                type: 'select',
                rowclass: 'year'
            },
            month: {
                type: 'select',
                rowclass: 'month'
            }
        }
    }
},
{
    countryCode: 'NL',
    name: {
        nl_NL: 'Netherland'
    },
    continent: 'europe',
    locales: ['nl_NL'],
    currencyCode: 'EUR',
    taxation: {
        type: 'net'
    },
    priceBooks: [
        'usd-list-prices',
        'usd-sale-prices'
    ],
    dynamicForms: {
        addressDetails: {
            country: {
                type: 'select'
            },
            states: [{
                fieldName: 'state',
                type: 'select',
                required: true
            }],
            address2: {
                help: {
                    cid: 'apo-fpo',
                    label: {
                        property: 'singleshipping.apofpo',
                        file: 'checkout'
                    }
                }
            },
            phone: {
                help: {
                    cid: 'help-telephone',
                    label: {
                        property: 'singleshipping.phonerequired',
                        file: 'checkout'
                    }
                }
            }
        },
        giftRegistryEvent: {
            eventaddress: [{
                fieldName: 'country',
                type: 'select'
            }, {
                fieldName: 'states.state',
                type: 'select',
                required: true
            }],
            type: {
                type: 'select'
            }
        },
        giftRegistrySearch: {
            simple: {
                eventType: {
                    type: 'select'
                }
            },
            advanced: {
                eventMonth: {
                    type: 'select'
                },
                eventYear: {
                    type: 'select'
                },
                eventAddress: [{
                    fieldName: 'states.state',
                    type: 'select'
                }, {
                    fieldName: 'country',
                    type: 'select'
                }]
            }
        },
        expirationInfo: {
            year: {
                type: 'select',
                rowclass: 'year'
            },
            month: {
                type: 'select',
                rowclass: 'month'
            }
        }
    }
},
{
    countryCode: 'DE',
    name: {
        de_DE: 'Germany'
    },
    continent: 'europe',
    locales: ['de_DE'],
    currencyCode: 'EUR',
    taxation: {
        type: 'net'
    },
    priceBooks: [
        'usd-list-prices',
        'usd-sale-prices'
    ],
    dynamicForms: {
        addressDetails: {
            country: {
                type: 'select'
            },
            states: [{
                fieldName: 'state',
                type: 'select',
                required: true
            }],
            address2: {
                help: {
                    cid: 'apo-fpo',
                    label: {
                        property: 'singleshipping.apofpo',
                        file: 'checkout'
                    }
                }
            },
            phone: {
                help: {
                    cid: 'help-telephone',
                    label: {
                        property: 'singleshipping.phonerequired',
                        file: 'checkout'
                    }
                }
            }
        },
        giftRegistryEvent: {
            eventaddress: [{
                fieldName: 'country',
                type: 'select'
            }, {
                fieldName: 'states.state',
                type: 'select',
                required: true
            }],
            type: {
                type: 'select'
            }
        },
        giftRegistrySearch: {
            simple: {
                eventType: {
                    type: 'select'
                }
            },
            advanced: {
                eventMonth: {
                    type: 'select'
                },
                eventYear: {
                    type: 'select'
                },
                eventAddress: [{
                    fieldName: 'states.state',
                    type: 'select'
                }, {
                    fieldName: 'country',
                    type: 'select'
                }]
            }
        },
        expirationInfo: {
            year: {
                type: 'select',
                rowclass: 'year'
            },
            month: {
                type: 'select',
                rowclass: 'month'
            }
        }
    }
},
{
    countryCode: 'DE',
    name: {
        de_AT: 'Austria'
    },
    continent: 'europe',
    locales: ['de_AT'],
    currencyCode: 'EUR',
    taxation: {
        type: 'net'
    },
    priceBooks: [
        'usd-list-prices',
        'usd-sale-prices'
    ],
    dynamicForms: {
        addressDetails: {
            country: {
                type: 'select'
            },
            states: [{
                fieldName: 'state',
                type: 'select',
                required: true
            }],
            address2: {
                help: {
                    cid: 'apo-fpo',
                    label: {
                        property: 'singleshipping.apofpo',
                        file: 'checkout'
                    }
                }
            },
            phone: {
                help: {
                    cid: 'help-telephone',
                    label: {
                        property: 'singleshipping.phonerequired',
                        file: 'checkout'
                    }
                }
            }
        },
        giftRegistryEvent: {
            eventaddress: [{
                fieldName: 'country',
                type: 'select'
            }, {
                fieldName: 'states.state',
                type: 'select',
                required: true
            }],
            type: {
                type: 'select'
            }
        },
        giftRegistrySearch: {
            simple: {
                eventType: {
                    type: 'select'
                }
            },
            advanced: {
                eventMonth: {
                    type: 'select'
                },
                eventYear: {
                    type: 'select'
                },
                eventAddress: [{
                    fieldName: 'states.state',
                    type: 'select'
                }, {
                    fieldName: 'country',
                    type: 'select'
                }]
            }
        },
        expirationInfo: {
            year: {
                type: 'select',
                rowclass: 'year'
            },
            month: {
                type: 'select',
                rowclass: 'month'
            }
        }
    }
},
{
    countryCode: 'BE',
    name: {
        fr_BE: 'Belgium'
    },
    continent: 'europe',
    locales: ['fr_BE'],
    currencyCode: 'EUR',
    taxation: {
        type: 'net'
    },
    priceBooks: [
        'usd-list-prices',
        'usd-sale-prices'
    ],
    dynamicForms: {
        addressDetails: {
            country: {
                type: 'select'
            },
            states: [{
                fieldName: 'state',
                type: 'select',
                required: true
            }],
            address2: {
                help: {
                    cid: 'apo-fpo',
                    label: {
                        property: 'singleshipping.apofpo',
                        file: 'checkout'
                    }
                }
            },
            phone: {
                help: {
                    cid: 'help-telephone',
                    label: {
                        property: 'singleshipping.phonerequired',
                        file: 'checkout'
                    }
                }
            }
        },
        giftRegistryEvent: {
            eventaddress: [{
                fieldName: 'country',
                type: 'select'
            }, {
                fieldName: 'states.state',
                type: 'select',
                required: true
            }],
            type: {
                type: 'select'
            }
        },
        giftRegistrySearch: {
            simple: {
                eventType: {
                    type: 'select'
                }
            },
            advanced: {
                eventMonth: {
                    type: 'select'
                },
                eventYear: {
                    type: 'select'
                },
                eventAddress: [{
                    fieldName: 'states.state',
                    type: 'select'
                }, {
                    fieldName: 'country',
                    type: 'select'
                }]
            }
        },
        expirationInfo: {
            year: {
                type: 'select',
                rowclass: 'year'
            },
            month: {
                type: 'select',
                rowclass: 'month'
            }
        }
    }
},
{
    countryCode: 'ES',
    name: {
        es_ES: 'Spain'
    },
    continent: 'europe',
    locales: ['es_ES'],
    currencyCode: 'EUR',
    taxation: {
        type: 'net'
    },
    priceBooks: [
        'usd-list-prices',
        'usd-sale-prices'
    ],
    dynamicForms: {
        addressDetails: {
            country: {
                type: 'select'
            },
            states: [{
                fieldName: 'state',
                type: 'select',
                required: true
            }],
            address2: {
                help: {
                    cid: 'apo-fpo',
                    label: {
                        property: 'singleshipping.apofpo',
                        file: 'checkout'
                    }
                }
            },
            phone: {
                help: {
                    cid: 'help-telephone',
                    label: {
                        property: 'singleshipping.phonerequired',
                        file: 'checkout'
                    }
                }
            }
        },
        giftRegistryEvent: {
            eventaddress: [{
                fieldName: 'country',
                type: 'select'
            }, {
                fieldName: 'states.state',
                type: 'select',
                required: true
            }],
            type: {
                type: 'select'
            }
        },
        giftRegistrySearch: {
            simple: {
                eventType: {
                    type: 'select'
                }
            },
            advanced: {
                eventMonth: {
                    type: 'select'
                },
                eventYear: {
                    type: 'select'
                },
                eventAddress: [{
                    fieldName: 'states.state',
                    type: 'select'
                }, {
                    fieldName: 'country',
                    type: 'select'
                }]
            }
        },
        expirationInfo: {
            year: {
                type: 'select',
                rowclass: 'year'
            },
            month: {
                type: 'select',
                rowclass: 'month'
            }
        }
    }
},
{
    countryCode: 'AT',
    name: {
        en_AT: 'Austria'
    },
    continent: 'europe',
    locales: ['en_AT'],
    currencyCode: 'EUR',
    taxation: {
        type: 'net'
    },
    priceBooks: [
        'usd-list-prices',
        'usd-sale-prices'
    ],
    dynamicForms: {
        addressDetails: {
            country: {
                type: 'select'
            },
            states: [{
                fieldName: 'state',
                type: 'select',
                required: true
            }],
            address2: {
                help: {
                    cid: 'apo-fpo',
                    label: {
                        property: 'singleshipping.apofpo',
                        file: 'checkout'
                    }
                }
            },
            phone: {
                help: {
                    cid: 'help-telephone',
                    label: {
                        property: 'singleshipping.phonerequired',
                        file: 'checkout'
                    }
                }
            }
        },
        giftRegistryEvent: {
            eventaddress: [{
                fieldName: 'country',
                type: 'select'
            }, {
                fieldName: 'states.state',
                type: 'select',
                required: true
            }],
            type: {
                type: 'select'
            }
        },
        giftRegistrySearch: {
            simple: {
                eventType: {
                    type: 'select'
                }
            },
            advanced: {
                eventMonth: {
                    type: 'select'
                },
                eventYear: {
                    type: 'select'
                },
                eventAddress: [{
                    fieldName: 'states.state',
                    type: 'select'
                }, {
                    fieldName: 'country',
                    type: 'select'
                }]
            }
        },
        expirationInfo: {
            year: {
                type: 'select',
                rowclass: 'year'
            },
            month: {
                type: 'select',
                rowclass: 'month'
            }
        }
    }
},
{
    countryCode: 'BE',
    name: {
        de_BE: 'Belgium'
    },
    continent: 'europe',
    locales: ['de_BE'],
    currencyCode: 'EUR',
    taxation: {
        type: 'net'
    },
    priceBooks: [
        'usd-list-prices',
        'usd-sale-prices'
    ],
    dynamicForms: {
        addressDetails: {
            country: {
                type: 'select'
            },
            states: [{
                fieldName: 'state',
                type: 'select',
                required: true
            }],
            address2: {
                help: {
                    cid: 'apo-fpo',
                    label: {
                        property: 'singleshipping.apofpo',
                        file: 'checkout'
                    }
                }
            },
            phone: {
                help: {
                    cid: 'help-telephone',
                    label: {
                        property: 'singleshipping.phonerequired',
                        file: 'checkout'
                    }
                }
            }
        },
        giftRegistryEvent: {
            eventaddress: [{
                fieldName: 'country',
                type: 'select'
            }, {
                fieldName: 'states.state',
                type: 'select',
                required: true
            }],
            type: {
                type: 'select'
            }
        },
        giftRegistrySearch: {
            simple: {
                eventType: {
                    type: 'select'
                }
            },
            advanced: {
                eventMonth: {
                    type: 'select'
                },
                eventYear: {
                    type: 'select'
                },
                eventAddress: [{
                    fieldName: 'states.state',
                    type: 'select'
                }, {
                    fieldName: 'country',
                    type: 'select'
                }]
            }
        },
        expirationInfo: {
            year: {
                type: 'select',
                rowclass: 'year'
            },
            month: {
                type: 'select',
                rowclass: 'month'
            }
        }
    }
},
{
    countryCode: 'BE',
    name: {
        en_BE: 'Belgium'
    },
    continent: 'europe',
    locales: ['en_BE'],
    currencyCode: 'EUR',
    taxation: {
        type: 'net'
    },
    priceBooks: [
        'usd-list-prices',
        'usd-sale-prices'
    ],
    dynamicForms: {
        addressDetails: {
            country: {
                type: 'select'
            },
            states: [{
                fieldName: 'state',
                type: 'select',
                required: true
            }],
            address2: {
                help: {
                    cid: 'apo-fpo',
                    label: {
                        property: 'singleshipping.apofpo',
                        file: 'checkout'
                    }
                }
            },
            phone: {
                help: {
                    cid: 'help-telephone',
                    label: {
                        property: 'singleshipping.phonerequired',
                        file: 'checkout'
                    }
                }
            }
        },
        giftRegistryEvent: {
            eventaddress: [{
                fieldName: 'country',
                type: 'select'
            }, {
                fieldName: 'states.state',
                type: 'select',
                required: true
            }],
            type: {
                type: 'select'
            }
        },
        giftRegistrySearch: {
            simple: {
                eventType: {
                    type: 'select'
                }
            },
            advanced: {
                eventMonth: {
                    type: 'select'
                },
                eventYear: {
                    type: 'select'
                },
                eventAddress: [{
                    fieldName: 'states.state',
                    type: 'select'
                }, {
                    fieldName: 'country',
                    type: 'select'
                }]
            }
        },
        expirationInfo: {
            year: {
                type: 'select',
                rowclass: 'year'
            },
            month: {
                type: 'select',
                rowclass: 'month'
            }
        }
    }
},
{
    countryCode: 'BE',
    name: {
        nl_BE: 'Belgium'
    },
    continent: 'europe',
    locales: ['nl_BE'],
    currencyCode: 'EUR',
    taxation: {
        type: 'net'
    },
    priceBooks: [
        'usd-list-prices',
        'usd-sale-prices'
    ],
    dynamicForms: {
        addressDetails: {
            country: {
                type: 'select'
            },
            states: [{
                fieldName: 'state',
                type: 'select',
                required: true
            }],
            address2: {
                help: {
                    cid: 'apo-fpo',
                    label: {
                        property: 'singleshipping.apofpo',
                        file: 'checkout'
                    }
                }
            },
            phone: {
                help: {
                    cid: 'help-telephone',
                    label: {
                        property: 'singleshipping.phonerequired',
                        file: 'checkout'
                    }
                }
            }
        },
        giftRegistryEvent: {
            eventaddress: [{
                fieldName: 'country',
                type: 'select'
            }, {
                fieldName: 'states.state',
                type: 'select',
                required: true
            }],
            type: {
                type: 'select'
            }
        },
        giftRegistrySearch: {
            simple: {
                eventType: {
                    type: 'select'
                }
            },
            advanced: {
                eventMonth: {
                    type: 'select'
                },
                eventYear: {
                    type: 'select'
                },
                eventAddress: [{
                    fieldName: 'states.state',
                    type: 'select'
                }, {
                    fieldName: 'country',
                    type: 'select'
                }]
            }
        },
        expirationInfo: {
            year: {
                type: 'select',
                rowclass: 'year'
            },
            month: {
                type: 'select',
                rowclass: 'month'
            }
        }
    }
},
{
    countryCode: 'DE',
    name: {
        en_DE: 'Germany'
    },
    continent: 'europe',
    locales: ['en_DE'],
    currencyCode: 'EUR',
    taxation: {
        type: 'net'
    },
    priceBooks: [
        'usd-list-prices',
        'usd-sale-prices'
    ],
    dynamicForms: {
        addressDetails: {
            country: {
                type: 'select'
            },
            states: [{
                fieldName: 'state',
                type: 'select',
                required: true
            }],
            address2: {
                help: {
                    cid: 'apo-fpo',
                    label: {
                        property: 'singleshipping.apofpo',
                        file: 'checkout'
                    }
                }
            },
            phone: {
                help: {
                    cid: 'help-telephone',
                    label: {
                        property: 'singleshipping.phonerequired',
                        file: 'checkout'
                    }
                }
            }
        },
        giftRegistryEvent: {
            eventaddress: [{
                fieldName: 'country',
                type: 'select'
            }, {
                fieldName: 'states.state',
                type: 'select',
                required: true
            }],
            type: {
                type: 'select'
            }
        },
        giftRegistrySearch: {
            simple: {
                eventType: {
                    type: 'select'
                }
            },
            advanced: {
                eventMonth: {
                    type: 'select'
                },
                eventYear: {
                    type: 'select'
                },
                eventAddress: [{
                    fieldName: 'states.state',
                    type: 'select'
                }, {
                    fieldName: 'country',
                    type: 'select'
                }]
            }
        },
        expirationInfo: {
            year: {
                type: 'select',
                rowclass: 'year'
            },
            month: {
                type: 'select',
                rowclass: 'month'
            }
        }
    }
}];
var Locale = require('dw/util/Locale');

/**
 * @description filter out the countries array to return only ones that are allowed in
 * site's allowedLocales
 * @return {array} allowedCountries array of countries that have allowed locales
 */
function getCountries() {
    // eslint-disable-next-line
    var site = dw.system.Site.getCurrent();
    var allowedLocales = site.getAllowedLocales();
    var allowedCountries = countries.filter(function (country) {
        var hasAllowedLocale = false;
        // loop over allowed locales
        for (var i = 0; i < allowedLocales.length; i += 1) {
            var locale = Locale.getLocale(allowedLocales[i]);
            if (country.countryCode === locale.country) {
                hasAllowedLocale = true;
                break;
            }
        }
        return hasAllowedLocale;
    });
    return allowedCountries;
}

/**
 * getCountriesGroupedBy
 * @param {Object} group group
 * @returns {Object} countriesGrouped
 */
function getCountriesGroupedBy(group) {
    var countriesGrouped = {};
    countries.forEach(function (country) {
        var key = Object.prototype.hasOwnProperty.call(country, group) ? country[group] : undefined;
        if (Object.prototype.hasOwnProperty.call(countriesGrouped, key)) {
            countriesGrouped[key].push(country);
        } else {
            countriesGrouped[key] = [country];
        }
    });
    return countriesGrouped;
}

/**
 * @description iterate over the countries array, find the first country that has the current locale
 * @param {PipelineDictionary} pdict the current pdict object
 * @return {Object} country the object containing the country's settings
 */
function getCurrent(pdict) {
    if (!countries || countries.length === 0) {
        return undefined;
    }
    var currentLocale = Locale.getLocale(pdict.CurrentRequest.locale);
    var country;
    if (!currentLocale.country) {
        return countries[0]; // return the first in the list if the requested one is not available
    }
    for (var i = 0; i < countries.length; i += 1) {
        var countryAtIndex = countries[i];
        if (countryAtIndex.countryCode === currentLocale.country) {
            country = countryAtIndex;
            break;
        }
    }
    return country || countries[0]; // return the first in the list if the requested one is not available
}

exports.getCountries = getCountries;
exports.getCountriesGroupedBy = getCountriesGroupedBy;
exports.getCurrent = getCurrent;
