pragma solidity ^0.4.15;

contract SmartInvoice2 {
    address[3] public suppliers;
    address[3] public buyers;
    uint[3] public ratings;

    function initDummy() {
        suppliers[0] = 0x826ac204372F51152EdfF31fA46E4cC5A31ECE5e;
        suppliers[1] = 0x18D54cca8608d90661244AF0FEb0A3D3Ad367aCD;
        suppliers[2] = 0x1605906e66a25EEc5ef206a1C8e2f99F24E6E253;

        buyers[0] = 0xc72B6404e8417b65E8c3cbb51e55aB719C6A37CC;
        buyers[1] = 0xf38157013B8E9AD41eE8092E6eA5D24fc38d928b;
        buyers[2] = 0x18D54cca8608d90661244AF0FEb0A3D3Ad367aCD;

        ratings[0] = 2;
        ratings[1] = 5;
        ratings[2] = 10;
    }

    function applyRating(uint id,uint _rating) public returns (uint) {
        require(id >= 0 && id <= 2);
        ratings[id] = _rating;

        return id;
    }

    function sell(uint id, address _buyer) public returns (uint) {
        require(id >= 0 && id <= 2);
        buyers[id] = _buyer;

        return id;
    }

    function getSuppliers() public returns (address[3]) {
        return suppliers;
    }

    function getBuyers() public returns (address[3]) {
        return buyers;
    }
    
    function getRatings() public returns (uint[3]) {
        return ratings;
    }
}