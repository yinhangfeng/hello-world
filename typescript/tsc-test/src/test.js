function test1(x, { aaa, bbb, ccc }) {
    return aaa;
}
test1(1, {
    aaa: 1,
    bbb: true,
    ccc: 'ccc',
});
