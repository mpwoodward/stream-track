const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const checkMatch = (query, name, nickname = '') => {
    const nQuery = normalize(query);
    const nName = normalize(name);
    const nNickname = nickname ? normalize(nickname) : '';

    const match = (" " + nName).includes(" " + nQuery) ||
        (" " + nNickname).includes(" " + nQuery);

    console.log(`Query: "${query}" | Target: "${name}" (${nickname}) -> Match: ${match}`);
    return match;
};

console.log("--- Test Cases ---");
// User examples
checkMatch("beas", "The Beast in Me"); // Should be true
checkMatch("al", "All Her Fault"); // Should be true
checkMatch("al", "Malice"); // Should be false
checkMatch("knives", "Wake Up Dead Man: A Knives Out Mystery"); // Should be true
checkMatch("the beas", "The Beast in Me"); // Should be true

// Additional edge cases
checkMatch("dead man", "Wake Up Dead Man: A Knives Out Mystery"); // Should be true (multi-word)
checkMatch("wake up", "Wake Up Dead Man"); // Should be true
checkMatch("mystery", "Wake Up Dead Man: A Knives Out Mystery"); // Should be true
checkMatch("out", "Knives Out"); // Should be true
