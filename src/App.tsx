import { useState } from 'react'
import { Label } from './components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'

const fontFamilies = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Verdana",
  "Comic Sans MS",
  "Impact",
  "Trebuchet MS",
  "Palatino"
];

const App = () => {
   const [fontFamily, setFontFamily] = useState("Arial");

   const handleFontFamilyChange = (value: string) => {
    setFontFamily(value);
    chrome.storage.sync.set({ fontFamily: value });
  };

  return (
    <div>
       <div className="space-y-2">
          <Label htmlFor="font-family" className="text-sm font-medium">
            Font Family
          </Label>
          <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
            <SelectTrigger id="font-family" className="w-full text-white">
              <SelectValue placeholder="Select font family" />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font} value={font}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
    </div>
  )
}

export default App