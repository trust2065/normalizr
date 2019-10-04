# URL

<https://github.com/paularmstrong/normalizr/>

## How to use

run `yarn runNode` to run `index.js` once

run `yarn watch` to run `index.js` when it updated

## It transforms nested data to flat and non-duplicate data

```javascript
// data
data = { users: [{ id: 1 }, { id: 10 }] };

// schema
mySchema = new schema.Object({
  users: new schema.Array(new schema.Entity("users"))
});
// can also simplify it as
mySchema = {
  users: [new schema.Entity("users")]
};

// result
transformedData = {
  entities: { users: { "1": { id: 1 }, "10": { id: 10 } } },
  result: { users: [1, 10] }
};
```

So that we can access certain data with index, such as `users[1] = ...`, instead of `_.get(users, {id: 1})`
And avoiding deep nested, repeat data in state.

## If types are different, we can also separate them by defining schema

```javascript
// data
data = { users: [{ id: 1, type: "A" }, { id: 10, type: "B" }] };

// schema
mySchema = new schema.Object({
  users: new schema.Array(
    {
      a: new schema.Entity("TEST_A"), //given divided data a home and name of object
      b: new schema.Entity("TEST_B")
    },
    input => input.type //divide by type
  )
});
result = normalize(data, mySchema);

// result
transformedData = {
  entities: {
    TEST_A: { "1": { id: 1, type: "a" } },
    TEST_B: { "10": { id: 10, type: "b" } }
  },
  result: { users: [{ id: 1, schema: "a" }, { id: 10, schema: "b" }] }
};
```

Example of nested, duplicate state

```javascript
data = {
  users: [{ id: 1, name: "Joy" }, { id: 2, name: "Tom" }],
  orders: [
    {
      id: 11,
      quantity: 2,
      order_user: { // This is duplicated, hopefully it can be an id
        id: 1,
        name: "Joy"
      }
    },
    {
      id: 12,
      quantity: 3,
      order_user: { // This is duplicated, hopefully it can be an id
        id: 1,
        name: "Joy"
      }
    },
    {
      id: 13,
      quantity: 4,
      order_user: { // This is duplicated, hopefully it can be an id
        id: 2,
        name: "Tom"
      }
    }
  ]
};

// Schema
const userSchema = new schema.Entity("users");

// This is the most important part, define duplicate part with its schema
const orderSchema = new schema.Entity("orders", {
  order_user: userSchema
});


mySchema = {
  users: [userSchema],
  orders: [orderSchema]
};
result = normalize(data, mySchema);

// result
{
  entities: {
    users: { "1": { id: 1, name: "Joy" }, "2": { id: 2, name: "Tom" } },
    orders: {
      "11": { id: 11, quantity: 2, order_user: 1 }, // order_user represent by its id now!
      "12": { id: 12, quantity: 3, order_user: 1 },
      "13": { id: 13, quantity: 4, order_user: 2 }
    }
  },
  result: { users: [1, 2], orders: [11, 12, 13] }
};

```
