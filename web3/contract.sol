// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract Storage {
     struct Entry {
        uint256 creationDate;
        string content;
    }
    
    // Mapping from user address to their entries
    mapping(address => Entry[]) private userEntries;
    
    // Add an entry for the sender
    function addEntry(string memory _content) public {
        userEntries[msg.sender].push(Entry({
            creationDate: block.timestamp,
            content: _content
        }));
    }
    
    // Get a specific entry for the caller
    function getMyEntry(uint256 _index) public view returns (uint256 creationDate, string memory content) {
        require(_index < userEntries[msg.sender].length, "Index out of bounds");
        Entry memory entry = userEntries[msg.sender][_index];
        return (entry.creationDate, entry.content);
    }
    
       function getAllMyEntries() public view returns (uint256[] memory creationDates, string[] memory contents) {
        uint256 entryCount = userEntries[msg.sender].length;
        
        creationDates = new uint256[](entryCount);
        contents = new string[](entryCount);
        
        for (uint256 i = 0; i < entryCount; i++) {
            Entry memory entry = userEntries[msg.sender][i];
            creationDates[i] = entry.creationDate;
            contents[i] = entry.content;
        }
        
        return (creationDates, contents);
    }
    
    // Get total number of entries for the caller
    function getMyEntryCount() public view returns (uint256) {
        return userEntries[msg.sender].length;
    }
}
