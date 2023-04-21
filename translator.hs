import System.IO

-- A Spell is a tuple of (name, level, circle)
type Spell = (String, Integer, [Circle])
type Circle = String

-- Takes in a line from the csv file and returns a Spell, filtering out empty lines
lineToSpell :: String -> Spell 
lineToSpell line = if length tokens == 0 then ("", 0, []) else (name, level, circles) where
    tokens = filterTokens (csvToTokens line)
    name = tokens !! 0
    level = read (tokens !! 1) :: Integer
    circles = map getCircle (drop 2 tokens)



-- Gets the circle from a String, some spells have a "-", which is supposed to be "Goal"
getCircle :: String -> Circle
getCircle "-"   = "Goal"
getCircle x     = x

-- Takes a String from a csv file and returns a list of String tokens
csvToTokens :: String -> [String]
csvToTokens []      = [""]
csvToTokens (x:xs)  = if x == ','
    then if take 3 xs == "x,x" -- "x,x" means we have two empty circles, so we can stop parsing the line
        then csvToTokens ""
        else [] : csvToTokens xs
    else (x : head (csvToTokens xs)) : tail (csvToTokens xs)


-- Filters out tokens that are empty or only contain "x"
filterTokens :: [String] -> [String]
filterTokens [] = []
filterTokens (x:xs) = if x == "x" || x == "" then filterTokens xs else x : filterTokens xs

printJSON :: [Spell] -> String 
printJSON spells = "{\n\t\"spells\": [" ++ (init . spellsToJSON) spells ++ "\n\t] \n}"

-- Print the spells in a JSON format
spellsToJSON :: [Spell] -> String
spellsToJSON [] = ""
spellsToJSON (x:xs) = newLineAndTab "{" 2 ++ newLineAndTab "" 3  ++ spellToJSON x ++ tab "}," 2 ++ spellsToJSON xs

-- Print a single spell in a JSON format
spellToJSON :: Spell -> String
spellToJSON (name, level, circles) = "\"name\": \"" ++ name ++ "\", " ++ newLineAndTab "\"level\": " 3 ++ show level ++ ", " ++ newLineAndTab "\"circles\": " 3 ++ circlesToJSON circles

circlesToJSON :: [Circle] -> String
circlesToJSON circles = "[\n" ++ circlesToJSON' circles ++ newLineAndTab "]\n" 3

circlesToJSON' :: [Circle] -> String
circlesToJSON' [] = ""
circlesToJSON' (x:xs) = tab (circleToJSON x) 4 ++ split ++ circlesToJSON' xs where split = if null xs then "" else ",\n"

circleToJSON :: Circle -> String
circleToJSON circle = "\"" ++ circle ++ "\""

newLineAndTab :: String -> Int -> String
newLineAndTab str n = "\n" ++ tab str n

tab :: String -> Int -> String
tab str n = replicate n '\t' ++ str

-- The main function takes in the csv file, 
main = do
    handle <- openFile "raw.csv" ReadMode
    contents <- hGetContents handle
    let contentsTrim = tail (tail (lines contents)) -- Remove the first two lines of the csv file (headers)
    let spells = map (lineToSpell) (contentsTrim)
    writeFile "output.json" (printJSON spells)
