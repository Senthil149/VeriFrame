from semantic_analyzer import analyze_semantics


image_path = "uploads/test.jpg"


result = analyze_semantics(
    image_path
)


print("\n================================")
print("SEMANTIC ANALYSIS RESULT")
print("================================")

print(
    "Success:",
    result["success"]
)

print(
    "Description:",
    result["description"]
)