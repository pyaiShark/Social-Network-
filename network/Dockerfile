# Use a base image
FROM python:3

# Copy the project
COPY . /usr/src/app

# Set the working directory in the container
WORKDIR /usr/src/app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Command to run your application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
