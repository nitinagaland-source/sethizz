lines = open('src/pages/HomePage.tsx', encoding='utf-8').readlines()

# Find the gradient scrim comment line and the Action Buttons comment line
start = None
end = None
for i, line in enumerate(lines):
    if 'Always-on gradient scrim for text readability' in line and start is None:
        start = i
    if 'Action Buttons placed lower down' in line and start is not None and end is None:
        end = i
        break

if start is not None and end is not None:
    print(f'Removing lines {start+1} to {end} (overlay block)')
    # Keep everything before start and from end onwards
    new_lines = lines[:start] + lines[end:]
    open('src/pages/HomePage.tsx', 'w', encoding='utf-8').writelines(new_lines)
    print('Done - overlay removed')
else:
    print(f'start={start}, end={end}')
    print('Could not find block - check manually')
