var ReactableObject = require("../../src/ReactableObject")

describe("ReactableObject", function() {
	it("notifies an observer when its properties change", function() {
		var o = new ReactableObject(["a", "b"]);

		o.onchange = jasmine.createSpy();

		o.a = "test";

		expect(o.a).toBe("test");
		expect(o.onchange).toHaveBeenCalled();
	});
});