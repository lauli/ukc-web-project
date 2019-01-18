import re
import requests
import sys

pattern = r'<img .* src="([\w\d\s:/.-]+?)">'
regex = re.compile(pattern)

class Scraping():
    """docstring for Scraping."""

    def __init__(self, arg):
        super(Scraping, self).__init__()
        self.arg = arg

    def Get_Images(URL):
        """
        A function that returns all image URLs found within a given website
        """

        print("\nAttempting to download images from the given URL.\n")
        r = requests.get(URL)

        if r.status_code != 200:
            print("Error retrieving the desired website. Aborting! Try again later.\n\n")
            sys.exit(1)
        elif r.status_code == 200:
            html = r.content

            All_Images = re.findall(regex, html)

            # You can either print the URLs found or return it as a list:
            print("\nPrinting all images found in the webpage:\n")
            for image in All_Images:
                print(image)
            print("\n\n")

        return All_Images[0];
