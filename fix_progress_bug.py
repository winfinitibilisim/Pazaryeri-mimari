import re

with open('src/pages/products/CreateProductPage.tsx', 'r') as f:
    content = f.read()

progress_calc = """
    // Calculate overall progress
    const nameProgress = productName.length > 0 ? 100 : 0;
    const imageProgress = Math.min((images.length / 5) * 100, 100);
    const featureProgress = productClass ? 100 : 0;
    const descProgress = Math.min((description.length / 50) * 100, 100);
    const totalProgress = Math.round((nameProgress + imageProgress + featureProgress + descProgress) / 4);
"""

# Remove all instances of progress_calc (including the ones with extra newline appended)
content = content.replace(progress_calc + "\n", "")
content = content.replace(progress_calc, "")

# Now inject it just before the final return of the component.
# The final return is "return (\n        <Box sx={{ width: '100%', pb: 5 }}>"
# Let's find that specific return.

target_return = "return (\n        <Box sx={{ width: '100%', pb: 5 }}>"
if target_return in content:
    content = content.replace(target_return, progress_calc + "\n    " + target_return)
else:
    # try another way
    target_return = "return (\n        <Box"
    content = content.replace(target_return, progress_calc + "\n    " + target_return)

with open('src/pages/products/CreateProductPage.tsx', 'w') as f:
    f.write(content)

print("Fixed CreateProductPage.tsx")
